// app/api/telegram-bot/[telegramChatId]/post/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import TelegramThread from "@/models/telegramThread";

export async function POST(request: Request, { params }: { params: { telegramChatId: string } }) {
    try {
        const { telegramChatId } = params;
        await dbConnect();

        if (!telegramChatId) {
            return NextResponse.json({ error: "Telegram Chat ID is required" }, { status: 400 });
        }

        const { language } = await request.json();

        // Validate language
        const supportedLanguages = ["en", "ar", "fa", "ps"];
        const languageKey = supportedLanguages.includes(language) ? language : "en"; // Default to English

        // Find or create Telegram thread
        let thread = await TelegramThread.findOne({ chatId: telegramChatId });
        if (!thread) {
            thread = new TelegramThread({
                chatId: telegramChatId,
                language: languageKey,
            });
        } else {
            thread.language = languageKey;
        }

        await thread.save();

        return NextResponse.json({ message: "Telegram thread updated successfully", thread });
    } catch (error) {
        console.error("Error in Telegram thread POST route:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}