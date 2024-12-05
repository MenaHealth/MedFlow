// app/api/telegram-bot/[telegramChatId]/save-message/route.ts

import { NextResponse } from "next/server";
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
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { telegramChatId } = params;
        const body = await request.json();

        const { text = "", sender, timestamp, type, mediaUrl = "" } = body;

        // Validate required fields
        if (!telegramChatId || !sender || !timestamp || !type) {
            console.error("Missing required fields");
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!['text', 'image', 'video', 'file', 'reply', 'forward', 'audio'].includes(type)) {
            console.error("Invalid message type");
            return NextResponse.json({ error: "Invalid message type" }, { status: 400 });
        }

        console.log(`Processing ${type} message for Chat ID: ${telegramChatId}`);

        // Fetch or create thread
        let thread = await TelegramThread.findOne({ chatId: telegramChatId });

        if (!thread) {
            console.log(`Thread not found for Chat ID ${telegramChatId}. Creating new thread.`);
            thread = new TelegramThread({ chatId: telegramChatId, messages: [] });
            await thread.save();
            console.log(`New thread created for Chat ID ${telegramChatId}`);
        }

        // Construct message object
        const newMessage = {
            text,
            sender,
            timestamp,
            type,
            mediaUrl,
        };

        // Save the message to the thread
        thread.messages.push(newMessage);
        await thread.save();

        console.log(`Message saved for Chat ID ${telegramChatId}:`, newMessage);
        return NextResponse.json({
            message: "Message saved successfully",
            savedMessage: newMessage,
        });
    } catch (error) {
        const err = error as Error;
        console.error("Error handling save-message request:", err.message || err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}