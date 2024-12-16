// app/api/telegram-bot/send-confirmation/route.ts
import { NextResponse } from "next/server";

const TELEGRAM_BOT_API_URL = process.env.TELEGRAM_BOT_API_URL || "https://api.telegram.org";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(request: Request) {
    try {
        const { telegramChatId, message } = await request.json();

        if (!TELEGRAM_BOT_TOKEN) {
            return NextResponse.json(
                { error: "Telegram bot token is missing from environment variables." },
                { status: 500 }
            );
        }

        if (!telegramChatId || !message) {
            return NextResponse.json(
                { error: "Missing required fields: telegramChatId or message." },
                { status: 400 }
            );
        }

        // Send message to Telegram Bot API
        const telegramResponse = await fetch(`${TELEGRAM_BOT_API_URL}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: message,
            }),
        });

        if (!telegramResponse.ok) {
            const errorData = await telegramResponse.json();
            console.error("Telegram API error:", errorData);
            throw new Error(`Telegram API responded with status: ${telegramResponse.status}`);
        }

        const telegramData = await telegramResponse.json();

        return NextResponse.json({
            message: "Confirmation message sent successfully.",
            telegramResponse: telegramData,
        });
    } catch (error) {
        console.error("Error sending confirmation message:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}