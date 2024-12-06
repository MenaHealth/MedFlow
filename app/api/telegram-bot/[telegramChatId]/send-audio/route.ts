// app/api/telegram-bot/[telegramChatId]/send-audio/route.ts

import TelegramThread from "@/models/telegramThread";
import dbConnect from "@/utils/database";
import { NextResponse } from "next/server";

const TELEGRAM_BOT_API_URL = process.env.TELEGRAM_BOT_API_URL || 'https://api.telegram.org';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(
    req: Request,
    { params }: { params: { telegramChatId: string } }
) {
    await dbConnect();

    try {
        const { telegramChatId } = params;
        const { mediaUrl, caption } = await req.json();

        if (!telegramChatId || !mediaUrl) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Send audio to Telegram bot
        const telegramResponse = await fetch(`${TELEGRAM_BOT_API_URL}/bot${TELEGRAM_BOT_TOKEN}/sendAudio`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                audio: mediaUrl,
                caption,
            }),
        });

        if (!telegramResponse.ok) {
            const errorData = await telegramResponse.json();
            console.error("Telegram API error:", errorData);
            throw new Error(`Telegram API responded with status: ${telegramResponse.status}`);
        }

        // Save the audio message to MongoDB
        let thread = await TelegramThread.findOne({ chatId: telegramChatId });
        if (!thread) {
            thread = new TelegramThread({ chatId: telegramChatId, messages: [] });
        }

        const newMessage = {
            text: caption || "Audio Note",
            sender: "You",
            timestamp: new Date(),
            type: "audio",
            mediaUrl,
        };
        thread.messages.push(newMessage);
        await thread.save();

        return NextResponse.json({
            message: "Audio sent and saved successfully",
            savedMessage: newMessage,
        });
    } catch (error) {
        console.error("Error handling send-audio request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}