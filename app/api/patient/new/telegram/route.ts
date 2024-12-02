// app/api/patient/new/telegram/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";
import { getSubmissionMessage, sendPatientRegistrationMessage } from "@/utils/telegram/signupConfirmation";

export async function POST(request: Request) {
    try {
        await dbConnect();

        // Parse request JSON
        const { telegramChatId, language, ...updateData } = await request.json();

        // Ensure required fields
        // if (!telegramChatId) {
        //     return NextResponse.json({ error: "Telegram Chat ID is required" }, { status: 400 });
        // }

        // Check if the patient exists or create a new one
        let patient = await Patient.findOne({ telegramChatId });

        if (!patient) {
            console.log("No patient found for Chat ID, creating a new patient.");
            patient = new Patient({
                telegramChatId,
                language: language || "english",
                hasSubmittedInfo: false,
                ...updateData, // Include any additional data
            });
            await patient.save();
        } else {
            console.log("Updating existing patient for Chat ID:", telegramChatId);
            Object.assign(patient, updateData);
            patient.language = language || patient.language;
            patient.hasSubmittedInfo = true;
            await patient.save();
        }

        // Generate registration URL
        const baseUrl = process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://medflow-mena-health.vercel.app";
        const registrationUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;

        // Send confirmation message with registration URL
        if (patient.telegramChatId) {
            const message = `${getSubmissionMessage(language || "english")}\n\nComplete your registration here: ${registrationUrl}`;
            await sendPatientRegistrationMessage(patient.telegramChatId, message);
            console.log(`Sent registration message to Chat ID ${telegramChatId}`);
        }

        return NextResponse.json({
            message: "Patient created or updated successfully",
            registrationUrl,
            patient,
        });
    } catch (error) {
        console.error("Error creating or updating patient:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}