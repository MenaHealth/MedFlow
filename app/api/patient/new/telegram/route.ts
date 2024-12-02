// app/api/patient/new/telegram/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";
import { getSubmissionMessage, sendPatientRegistrationMessage } from "@/utils/telegram/signupConfirmation";

export async function POST(request: Request) {
    try {
        await dbConnect();

        // Parse request JSON
        const { patientId, telegramChatId, language, ...updateData } = await request.json();

        let patient;

        // If patientId is provided, use it to find and update the patient
        if (patientId) {
            console.log("Fetching patient by ID:", patientId);
            patient = await Patient.findById(patientId);

            if (!patient) {
                console.error("Patient not found for provided ID:", patientId);
                return NextResponse.json({ error: "Patient not found" }, { status: 404 });
            }

            // Update existing patient
            Object.assign(patient, updateData);
            patient.language = language || patient.language;
            patient.hasSubmittedInfo = true;

            // Ensure the Telegram Chat ID is preserved
            if (!patient.telegramChatId && telegramChatId) {
                patient.telegramChatId = telegramChatId;
            }

            await patient.save();
        } else {
            // If no patientId is provided, attempt to find by telegramChatId or create a new patient
            if (!telegramChatId) {
                return NextResponse.json({ error: "Patient ID or Telegram Chat ID is required" }, { status: 400 });
            }

            console.log("Fetching patient by Telegram Chat ID:", telegramChatId);
            patient = await Patient.findOne({ telegramChatId });

            if (!patient) {
                console.log("No patient found for Telegram Chat ID. Creating a new patient.");
                patient = new Patient({
                    telegramChatId,
                    language: language || "english",
                    hasSubmittedInfo: false,
                    ...updateData, // Include additional data
                });
                await patient.save();
            } else {
                console.log("Updating existing patient for Telegram Chat ID:", telegramChatId);
                Object.assign(patient, updateData);
                patient.language = language || patient.language;
                patient.hasSubmittedInfo = true;
                await patient.save();
            }
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