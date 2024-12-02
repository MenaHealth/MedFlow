// app/api/telegram-bot/[telegramChatId]/save-message/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect from "@/utils/database";
import TelegramThread from "@/models/telegramThread";
import { validateApiKey } from "@/utils/telegram/validateApiKey";

const CHATBOT_LOGGING_URL = process.env.CHATBOT_LOGGING_URL || "https://chatbot-server.com/api/logs";

async function sendLogToChatbot(log: object) {
    try {
        await axios.post(CHATBOT_LOGGING_URL, log, {
            headers: { "Content-Type": "application/json" },
        });
        console.log("Log sent to chatbot server:", log);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Failed to send log to chatbot server:", error.message);
            const errorLog = { event: "Error saving message", error: error.message };
        } else {
            console.error("Unexpected error:", error);
            const errorLog = { event: "Error saving message", error: String(error) };
        }
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { telegramChatId: string } }
) {
    console.log("PATCH /api/telegram-bot/:telegramChatId/save-message called");
    console.log("Request Params:", params);

    await dbConnect();
    console.log("Database connected");

    const authHeader = request.headers.get("Authorization");
    console.log("Authorization Header:", authHeader);

    if (!validateApiKey(authHeader)) {
        const errorLog = { event: "Authorization failed", authHeader };
        await sendLogToChatbot(errorLog);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { telegramChatId } = params;
        const body = await request.json();

        console.log("Request Body:", body);

        const { text, sender, timestamp } = body;

        if (!telegramChatId || !text || !sender || !timestamp) {
            const errorLog = { event: "Missing required fields", params, body };
            await sendLogToChatbot(errorLog);
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        console.log(`Processing message for Chat ID: ${telegramChatId}`);

        let thread = await TelegramThread.findOne({ chatId: telegramChatId });

        if (!thread) {
            console.log(`Thread not found for Chat ID ${telegramChatId}. Creating new thread.`);
            thread = new TelegramThread({ chatId: telegramChatId, messages: [] });
        }

        const newMessage = { text, sender, timestamp, type: "text" };
        thread.messages.push(newMessage);
        await thread.save();

        console.log(`Message saved for Chat ID ${telegramChatId}:`, newMessage);

        const successLog = { event: "Message saved", telegramChatId, newMessage };
        await sendLogToChatbot(successLog);

        return NextResponse.json({
            status: "Message saved successfully",
            savedMessage: newMessage,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Failed to send log to chatbot server:", error.message);
        } else {
            console.error("Unexpected error:", error);
        }
    }
}