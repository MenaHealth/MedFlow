// app/api/telegram-bot/[telegramChatId]/save-message/route.ts

import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect from "@/utils/database";
import TelegramThread from "@/models/telegramThread";
import { validateApiKey } from "@/utils/telegram/validateApiKey";

const CHATBOT_LOGGING_URL = process.env.CHATBOT_LOGGING_URL || "https://chatbot-server.com/api/logs";
const BASE_URL = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://medflow-mena-health.vercel.app";

async function sendLogToChatbot(log: object) {
    try {
        await axios.post(CHATBOT_LOGGING_URL, log, {
            headers: { "Content-Type": "application/json" },
        });
        console.log("Log sent to chatbot server:", log);
    } catch (error) {
        console.error("Failed to send log to chatbot server:", (error as Error).message || error);
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
    if (!validateApiKey(authHeader)) {
        await sendLogToChatbot({ event: "Authorization failed", authHeader });
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { telegramChatId } = params;
        const body = await request.json();

        const { text, sender, timestamp, language = "english" } = body;
        if (!telegramChatId || !text || !sender || !timestamp) {
            await sendLogToChatbot({ event: "Missing required fields", params, body });
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        console.log(`Processing message for Chat ID: ${telegramChatId}`);
        let thread = await TelegramThread.findOne({ chatId: telegramChatId });

        // Create a new thread if it does not exist
        if (!thread) {
            console.log(`Thread not found for Chat ID ${telegramChatId}. Creating new thread.`);
            thread = new TelegramThread({ chatId: telegramChatId, messages: [] });
            await thread.save();

            // Call the `/new/telegram` API
            console.log(`Triggering /new/telegram API for chat ID ${telegramChatId}`);
            const registrationResponse = await axios.post(
                `${BASE_URL}/api/patient/new/telegram`,
                {
                    telegramChatId, // Pass as part of update data
                    language,
                },
                {
                    headers: {
                        Authorization: authHeader,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (registrationResponse.status !== 200) {
                console.error("Error triggering /new/telegram API:", registrationResponse.data);
            } else {
                console.log("Patient registration handled successfully:", registrationResponse.data);
            }
        }

        // Save the incoming message
        const newMessage = { text, sender, timestamp, type: "text" };
        thread.messages.push(newMessage);
        await thread.save();

        console.log(`Message saved for Chat ID ${telegramChatId}:`, newMessage);
        return NextResponse.json({ message: "Message saved successfully", savedMessage: newMessage });
    } catch (error) {
        console.error("Error handling save-message request:", (error as Error).message || error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}