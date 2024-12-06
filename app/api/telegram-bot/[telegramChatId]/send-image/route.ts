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

        if (!telegramChatId || !mediaUrl) {
            return NextResponse.json(
                { error: "Missing required fields (telegramChatId or mediaUrl)" },
                { status: 400 }
            );
        }

        console.log("[DEBUG] Sending signed URL to Telegram:", {
            chatId: telegramChatId,
            mediaUrl,
            caption,
            fullUrl: `${TELEGRAM_BOT_API_URL}/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`
        });

        const telegramResponse = await fetch(`${TELEGRAM_BOT_API_URL}/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                photo: mediaUrl,
                caption,
            }),
        });

        // Improved error handling
        if (!telegramResponse.ok) {
            const errorText = await telegramResponse.text();
            console.error("Telegram API full response:", {
                status: telegramResponse.status,
                statusText: telegramResponse.statusText,
                body: errorText
            });

            return NextResponse.json(
                {
                    error: "Failed to send photo to Telegram",
                    details: errorText
                },
                { status: telegramResponse.status }
            );
        }

        // Rest of your existing code...
    } catch (error: any) {
        console.error("Error handling send-image request:", error);
        return NextResponse.json({
            error: "Internal server error",
            message: error.message
        }, { status: 500 });
    }
}