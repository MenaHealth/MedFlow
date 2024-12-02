// app/api/telegram-bot/[telegramChatId]/post/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import { createOrGetPatient } from "@/utils/telegram/patientHelpers";
import { getSubmissionMessage, sendPatientRegistrationMessage } from "@/utils/telegram/signupConfirmation";

export async function POST(request: Request, { params }: { params: { telegramChatId: string } }) {
    try {
        const { telegramChatId } = params;
        await dbConnect();

        const updateData = await request.json();

        if (!telegramChatId) {
            return NextResponse.json({ error: "Telegram Chat ID is required" }, { status: 400 });
        }

        // Ensure patient exists or create a new one
        const patientId = await createOrGetPatient(telegramChatId, updateData.language);

        // Construct the registration URL
        const baseUrl = process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://medflow-mena-health.vercel.app";
        const registrationUrl = `${baseUrl}/new-patient/telegram/${patientId}`;

        // Generate and send the Telegram message
        const message = `${getSubmissionMessage(updateData.language || "english")}\n\nComplete your registration here: ${registrationUrl}`;
        await sendPatientRegistrationMessage(telegramChatId, message);

        // Return the registration URL for debugging or potential future uses
        return NextResponse.json({ message: "Patient data saved and message sent successfully", registrationUrl });
    } catch (error) {
        console.error("Error saving patient data and sending message:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}