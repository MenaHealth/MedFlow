// app/api/telegram-bot/[telegramChatId]/save-message/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import TelegramThread from "@/models/telegramThread";
import { validateApiKey } from "@/utils/telegram/validateApiKey";

export async function PATCH(
    request: Request,
    { params }: { params: { telegramChatId: string } }
) {
    await dbConnect();

    const authHeader = request.headers.get("Authorization");

    if (!validateApiKey(authHeader)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { telegramChatId } = params;
        const { text, sender, timestamp } = await request.json();

        if (!telegramChatId || !text || !sender || !timestamp) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        let thread = await TelegramThread.findOne({ chatId: telegramChatId });

        if (!thread) {
            thread = new TelegramThread({ chatId: telegramChatId, messages: [] });
        }

        const newMessage = { text, sender, timestamp, type: "text" };
        thread.messages.push(newMessage);
        await thread.save();

        return NextResponse.json({
            status: "Message saved successfully",
            savedMessage: newMessage,
        });
    } catch (error) {
        console.error("Error saving message:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


