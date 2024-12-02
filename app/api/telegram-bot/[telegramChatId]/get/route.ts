// app/api/telegram-bot/[telegramChatId]/get/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import TelegramThread from "@/models/telegramThread";

export async function GET(request: Request, { params }: { params: { telegramChatId: string } }) {
    console.log("GET /api/telegram-bot/:telegramChatId/get called");
    console.log("Request Params:", params);

    try {
        await dbConnect();
        console.log("Database connected");

        const { telegramChatId } = params;

        if (!telegramChatId) {
            console.error("Telegram Chat ID is missing.");
            return NextResponse.json({ error: "Telegram Chat ID is required" }, { status: 400 });
        }

        // Fetch the thread for the given chat ID
        console.log(`Fetching thread for Chat ID: ${telegramChatId}`);
        const thread = await TelegramThread.findOne({ chatId: telegramChatId });

        if (!thread) {
            console.error(`Thread not found for Chat ID: ${telegramChatId}`);
            return NextResponse.json({ error: "Thread not found" }, { status: 404 });
        }

        console.log(`Thread found for Chat ID ${telegramChatId}:`, thread.messages);

        return NextResponse.json({ messages: thread.messages });
    } catch (error) {
        console.error("Error retrieving messages:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}