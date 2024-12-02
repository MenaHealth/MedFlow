// app/api/patient/new/telegram/route.ts

// app/api/patient/new/telegram/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";
import { getSubmissionMessage, sendPatientRegistrationMessage } from "@/utils/telegram/signupConfirmation";

export async function POST(request: Request) {
    try {
        await dbConnect();

        // Parse request JSON
        const { patientId, language, ...updateData } = await request.json();

        if (!patientId) {
            return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
        }

        // Fetch the patient from the database
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        // Update patient details
        Object.assign(patient, updateData);
        patient.hasSubmittedInfo = true;
        await patient.save();

        // Send confirmation message if the patient has a Telegram chat ID
        if (patient.telegramChatId) {
            const message = getSubmissionMessage(patient.language || language || "english");
            await sendPatientRegistrationMessage(patient.telegramChatId, message);
        }

        return NextResponse.json({ message: "Patient updated successfully", patient });
    } catch (error) {
        console.error("Error updating patient:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}