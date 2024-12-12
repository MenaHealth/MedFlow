// app/api/patient/new/telegram/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";
import TelegramThread from "@/models/telegramThread"; // Import the model
import { getRegistrationMessage } from "@/utils/telegram/postRegistrationConfirmation";

export async function POST(request: Request) {
    try {
        await dbConnect();

        // Extract data from the request body
        const { patientId, language, ...updateData } = await request.json();

        if (!patientId) {
            return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
        }

        // Validate language
        const supportedLanguages = ["English", "Arabic", "Farsi", "Pashto"];
        const patientLanguage = supportedLanguages.includes(language) ? language : "English";

        // Check if the patient already exists
        let patient = await Patient.findById(patientId);
        if (!patient) {
            // If patient does not exist, create a new patient
            patient = new Patient({
                _id: patientId,
                language: patientLanguage,
                ...updateData,
            });
            await patient.save();
        } else {
            // If patient exists, update their data
            patient.language = patientLanguage;
            Object.assign(patient, updateData);
            await patient.save();
        }

        // At this point, we have `patient._id` and `patient.telegramChatId`.
        // Update the TelegramThread with the patientId.
        if (patient.telegramChatId) {
            await TelegramThread.findOneAndUpdate(
                { chatId: patient.telegramChatId },
                { $set: { patientId: patient._id } },
                { new: true }
            );
        }

        // Generate the language-based message
        const message = getRegistrationMessage(patientLanguage);

        // Send the confirmation message
        const confirmationMessageResponse = await fetch(
            `${process.env.NEXTAUTH_URL}/api/telegram-bot/send-confirmation`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    telegramChatId: patient.telegramChatId,
                    message, // Translated message based on patient's language
                }),
            }
        );

        if (!confirmationMessageResponse.ok) {
            console.error("Failed to send confirmation message via new API.");
            throw new Error("Confirmation message failed.");
        }

        return NextResponse.json({ message: "Patient created/updated successfully", patient });
    } catch (error) {
        console.error("Error creating/updating patient:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}