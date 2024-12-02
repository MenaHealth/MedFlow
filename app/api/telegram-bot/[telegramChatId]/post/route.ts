// app/api/telegram-bot/[telegramChatId]/post/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import { createOrGetPatient } from "@/utils/telegram/patientHelpers";
import { getPatientSignupMessage } from "@/utils/telegram/patientSignupLink";

export async function POST(request: Request, { params }: { params: { telegramChatId: string } }) {
    try {
        const { telegramChatId } = params;
        await dbConnect();

        const updateData = await request.json();

        if (!telegramChatId) {
            return NextResponse.json({ error: "Telegram Chat ID is required" }, { status: 400 });
        }

        const { language } = updateData;

        if (!language) {
            return NextResponse.json({ error: "Language is required" }, { status: 400 });
        }

        // Ensure patient exists or create a new one
        const patientId = await createOrGetPatient(telegramChatId, language);

        // Construct the registration URL
        const baseUrl = process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://medflow-mena-health.vercel.app";
        const registrationUrl = `${baseUrl}/new-patient/telegram/${patientId}`;

        // Generate the patient signup message
        const message = getPatientSignupMessage(language.toLowerCase(), registrationUrl);

        // Return the message and registration URL
        return NextResponse.json({
            message,
            registrationUrl,
        });
    } catch (error) {
        console.error("Error saving patient data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}