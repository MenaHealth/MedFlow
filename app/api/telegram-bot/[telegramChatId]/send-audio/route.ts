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
    await dbConnect();

    try {
        console.log("[DEBUG] Starting send-audio process");
        const { telegramChatId } = params;
        const body = await request.json();
        console.log("[DEBUG] Received body at /send-audio:", body);

        // Decode the signed URL
        const { signedAudioUrl, caption } = body;
        const decodedUrl = decodeURIComponent(signedAudioUrl);
        console.log("Decoded signedAudioUrl:", decodedUrl);

        if (!telegramChatId || !decodedUrl) {
            console.error("[ERROR] Missing required fields:", { telegramChatId, signedAudioUrl: decodedUrl });
            return NextResponse.json(
                { error: "Missing required fields (telegramChatId or signedAudioUrl)" },
                { status: 400 }
            );
        }

        console.log("[DEBUG] Sending signed URL to Telegram for audio:", {
            chatId: telegramChatId,
            signedAudioUrl: decodedUrl,
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
                audio: decodedUrl,
                caption,
            }),
        });

        console.log("[DEBUG] Telegram API response status:", telegramResponse.status, telegramResponse.statusText);

        if (!telegramResponse.ok) {
            const errorText = await telegramResponse.text();
            console.error("Telegram API full response:", {
                status: telegramResponse.status,
                statusText: telegramResponse.statusText,
                body: errorText,
            });

            return NextResponse.json(
                {
                    error: "Failed to send audio to Telegram",
                    details: errorText,
                },
                { status: telegramResponse.status }
            );
        }

        const telegramData = await telegramResponse.json();
        console.log("[INFO] Audio sent to Telegram successfully:", JSON.stringify(telegramData, null, 2));

        const publicAudioUrl = decodedUrl.split("?")[0];

        let thread = await TelegramThread.findOne({ chatId: telegramChatId });
        if (!thread) {
            thread = new TelegramThread({ chatId: telegramChatId, messages: [] });
        }

        const newMessage = {
            text: caption || "Audio message",
            sender: "You",
            timestamp: new Date(),
            type: "audio",
            audioUrl: publicAudioUrl,
        };

        thread.messages.push(newMessage);
        await thread.save();

        console.log("[INFO] Audio message saved in database successfully.");

        return NextResponse.json({ message: "Audio sent and saved successfully", savedMessage: newMessage }, { status: 200 });
    } catch (error: any) {
        console.error("Error handling send-audio request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}



