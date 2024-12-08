// app/api/telegram-bot/[telegramChatId]/send-audio/route.ts
import TelegramThread from "@/models/telegramThread";
import dbConnect from "@/utils/database";
import { NextResponse } from "next/server";

const TELEGRAM_BOT_API_URL = process.env.TELEGRAM_BOT_API_URL || 'https://api.telegram.org';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(
    request: Request,
    { params }: { params: { telegramChatId: string } }
) {
    console.log("[DEBUG] Entering send-audio route with params:", params);
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

        console.log("[DEBUG] Sending signed URL to Telegram for audio:", {
            chatId: telegramChatId,
            mediaUrl,
            caption,
            fullUrl: `${TELEGRAM_BOT_API_URL}/bot${TELEGRAM_BOT_TOKEN}/sendAudio`,
        });

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
            const errorText = await telegramResponse.text();
            console.error("Telegram API full response:", {
                status: telegramResponse.status,
                statusText: telegramResponse.statusText,
                body: errorText,
            });
            console.log(mediaUrl);

            return NextResponse.json(
                {
                    error: "Failed to send audio to Telegram",
                    details: errorText,
                    mediaURL: mediaUrl,
                },
                { status: telegramResponse.status }
            );
        }

        // Telegram API was successful
        const telegramData = await telegramResponse.json();
        const publicMediaUrl = mediaUrl.split("?")[0]; // Extract the base URL from the signed URL

        console.log("[INFO] Audio sent to Telegram successfully:", telegramData);

        // Save the message in the database
        let thread = await TelegramThread.findOne({ chatId: telegramChatId });
        if (!thread) {
            thread = new TelegramThread({ chatId: telegramChatId, messages: [] });
        }

        const newMessage = {
            text: caption || "Audio message",
            sender: "You",
            timestamp: new Date(),
            type: "audio",
            mediaUrl: publicMediaUrl,
        };

        thread.messages.push(newMessage);
        await thread.save();

        console.log("[INFO] Audio message saved in database successfully.");

        return NextResponse.json({ message: "Audio sent and saved successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error handling send-audio request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}