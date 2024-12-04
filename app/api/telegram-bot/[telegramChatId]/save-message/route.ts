// app/api/telegram-bot/[telegramChatId]/save-message/route.ts

// app/api/telegram-bot/[telegramChatId]/save-message/route.ts

import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect from "@/utils/database";
import TelegramThread from "@/models/telegramThread";
import { validateApiKey } from "@/utils/telegram/validateApiKey";


export async function PATCH(
    request: Request,
    { params }: { params: { telegramChatId: string } }
) {
    console.log("PATCH /api/telegram-bot/:telegramChatId/save-message called");

    await dbConnect();
    console.log("Database connected");

    const authHeader = request.headers.get("Authorization");
    if (!validateApiKey(authHeader)) {
        console.error("Authorization failed");
        console.log("Received Authorization Header:", authHeader);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { telegramChatId } = params;
        const body = await request.json();

        const { text, sender, timestamp, type = "text", mediaUrl = "" } = body;
        if (!telegramChatId || !text || !sender || !timestamp || !type) {
            console.error("Missing required fields");
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        console.log(`Processing message for Chat ID: ${telegramChatId}`);
        let thread = await TelegramThread.findOne({ chatId: telegramChatId });

        if (!thread) {
            console.log(`Thread not found for Chat ID ${telegramChatId}. Creating new thread.`);
            thread = new TelegramThread({ chatId: telegramChatId, messages: [] });
            await thread.save();
            console.log(`New thread created for Chat ID ${telegramChatId}`);
        }

        const newMessage = {
            text, // Save the caption as text
            sender,
            timestamp,
            type,
            mediaUrl, // Save the S3 URL for the image
        };

        thread.messages.push(newMessage);
        await thread.save();

        console.log(`Message saved for Chat ID ${telegramChatId}:`, newMessage);
        return NextResponse.json({ message: "Message saved successfully", savedMessage: newMessage });
    } catch (error) {
        console.error("Error handling save-message request:", (error as Error).message || error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}