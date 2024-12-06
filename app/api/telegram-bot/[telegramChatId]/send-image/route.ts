// app/api/telegram-bot/[telegramChatId]/send-image/route.ts
// app/api/telegram-bot/[telegramChatId]/send-image/route.ts
import TelegramThread from "@/models/telegramThread";
import dbConnect from "@/utils/database";
import { NextResponse } from "next/server";

const TELEGRAM_BOT_API_URL = process.env.TELEGRAM_BOT_API_URL || 'https://api.telegram.org';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(
    request: Request,
    { params }: { params: { telegramChatId: string } }
) {
    await dbConnect();

    try {
        const { telegramChatId } = params;
        const { mediaUrl, caption } = await request.json();

        // Validate inputs
        if (!telegramChatId || !mediaUrl) {
            return NextResponse.json(
                { error: "Missing required fields (telegramChatId or mediaUrl)" },
                { status: 400 }
            );
        }

        // Log the inputs
        console.log(`[DEBUG] Sending image to Telegram`, { telegramChatId, mediaUrl, caption });

        // Send image URL to Telegram
        const telegramResponse = await fetch(`${TELEGRAM_BOT_API_URL}/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                photo: mediaUrl, // Pass the public URL of the uploaded photo
                caption,
            }),
        });

        // Handle Telegram API errors
        if (!telegramResponse.ok) {
            const errorData = await telegramResponse.json();
            console.error("Telegram API error:", errorData);
            throw new Error(`Telegram API responded with status: ${telegramResponse.status}`);
        }

        // Save the message in MongoDB
        let thread = await TelegramThread.findOne({ chatId: telegramChatId });
        if (!thread) {
            thread = new TelegramThread({ chatId: telegramChatId, messages: [] });
        }

        const newMessage = {
            text: caption || "Image",
            sender: "You",
            timestamp: new Date(),
            type: "image",
            mediaUrl, // Save the URL in the thread
        };
        thread.messages.push(newMessage);
        await thread.save();

        return NextResponse.json({
            message: "Image sent and saved successfully",
            savedMessage: newMessage,
        });
    } catch (error: any) {
        console.error("Error handling send-image request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}