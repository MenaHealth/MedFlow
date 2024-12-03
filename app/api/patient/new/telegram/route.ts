// app/api/patient/new/telegram/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";
import TelegramThread from "@/models/telegramThread";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { telegramChatId } = await request.json();
        if (!telegramChatId) {
            return NextResponse.json({ error: "Telegram Chat ID is required" }, { status: 400 });
        }

        // Fetch the Telegram thread
        const thread = await TelegramThread.findOne({ chatId: telegramChatId });
        if (!thread) {
            return NextResponse.json({ error: "Telegram thread not found" }, { status: 404 });
        }

        // Check if the patient already exists
        let patient = await Patient.findOne({ telegramChatId });
        if (!patient) {
            // Create new patient
            patient = new Patient({
                telegramChatId,
                language: thread.language,
            });
            await patient.save();
        }

        return NextResponse.json({ message: "Patient created successfully", patient });
    } catch (error) {
        console.error("Error creating patient:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}