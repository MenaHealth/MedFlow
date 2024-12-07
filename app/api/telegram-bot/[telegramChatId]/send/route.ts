// app/api/telegram-bot/[telegramChatId]/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import TelegramThread from "@/models/telegramThread";

const TELEGRAM_BOT_API_URL = process.env.TELEGRAM_BOT_API_URL || 'https://api.telegram.org';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is not set in the environment variables');
}

export async function POST(
    request: NextRequest,
    { params }: { params: { telegramChatId: string } }
) {
    await dbConnect();

    try {
        const { telegramChatId } = params;
        const { text } = await request.json();

        if (!telegramChatId || !text) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Send message to Telegram Bot API
        const telegramResponse = await fetch(`${TELEGRAM_BOT_API_URL}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: text,
            }),
        });

        if (!telegramResponse.ok) {
            const errorData = await telegramResponse.json();
            console.error('Telegram API error:', errorData);
            throw new Error(`Telegram API responded with status: ${telegramResponse.status}`);
        }

        const telegramData = await telegramResponse.json();

        // Save message to database
        let thread = await TelegramThread.findOne({ chatId: telegramChatId });

        if (!thread) {
            thread = new TelegramThread({ chatId: telegramChatId, messages: [] });
        }

        const newMessage = {
            text,
            sender: "You",
            timestamp: new Date(),
            type: 'text'
        };
        thread.messages.push(newMessage);
        await thread.save();

        return NextResponse.json({
            message: "Message sent to Telegram and saved successfully",
            telegramResponse: telegramData,
            savedMessage: newMessage,
        });
    } catch (error) {
        console.error("Error sending message to Telegram or saving to database:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


