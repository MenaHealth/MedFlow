// app/api/telegram-bot/[telegramChatId]/post/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";

export async function POST(request: Request, { params }: { params: { telegramChatId: string } }) {
    try {
        const { telegramChatId } = params;
        await dbConnect();

        const updateData = await request.json();

        if (!telegramChatId) {
            return NextResponse.json({ error: "Telegram Chat ID is required" }, { status: 400 });
        }

        let patient = await Patient.findOne({ telegramChatId });

        if (!patient) {
            // Create a new patient if not found
            patient = new Patient({
                telegramChatId,
                ...updateData,
            });
        } else {
            // Update existing patient
            Object.assign(patient, updateData);
        }

        await patient.save();

        return NextResponse.json({ message: "Patient data saved successfully", patient });
    } catch (error) {
        console.error("Error saving patient data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}