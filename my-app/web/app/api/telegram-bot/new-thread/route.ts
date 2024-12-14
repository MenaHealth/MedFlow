// app/api/telegram-bot/new-thread/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import TelegramThread from "@/models/telegramThread";
import { Languages } from "@/data/languages.enum";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { telegramChatId, language } = await request.json();
        if (!telegramChatId) {
            return NextResponse.json({ error: "Telegram Chat ID is required" }, { status: 400 });
        }

        // Validate language (default to English if not provided)
        const supportedLanguages = Object.values(Languages);
        const languageValue = supportedLanguages.includes(language) ? language : Languages.ENGLISH;

        // Check if the Telegram thread already exists
        let thread = await TelegramThread.findOne({ chatId: telegramChatId });
        if (!thread) {
            thread = new TelegramThread({
                chatId: telegramChatId,
                language: languageValue,
                messages: [],
                status: "active",
            });
            await thread.save();
            return NextResponse.json({ message: "Telegram thread created successfully", thread });
        } else {
            thread.language = languageValue;
            await thread.save();
            return NextResponse.json({ message: "Telegram thread updated successfully", thread });
        }
    } catch (error) {
        console.error("Error creating or updating Telegram thread:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}