// app/api/telegram-bot/route.ts

import { NextResponse } from 'next/server';
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";

export async function POST(request: Request) {
    const debugInfo: Record<string, any> = {}; // Store debugging information

    try {
        await dbConnect();

        const authHeader = request.headers.get('Authorization');
        const providedKey = authHeader ? decodeURIComponent(authHeader.split(' ')[1]) : null;
        const expectedKey = process.env.NODE_ENV === 'development'
            ? process.env.DEV_TELEGRAM_BOT_KEY
            : process.env.PROD_TELEGRAM_BOT_KEY;

        debugInfo.providedKey = providedKey;
        debugInfo.expectedKey = expectedKey;

        if (providedKey !== expectedKey) {
            debugInfo.error = "Unauthorized: Keys do not match";
            return NextResponse.json({ error: "Unauthorized", debug: debugInfo }, { status: 401 });
        }

        // Extract chatId and language from the request body
        const { chatId, language } = await request.json();
        debugInfo.chatId = chatId;
        debugInfo.language = language;

        const baseUrl = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/+$/, "");
        debugInfo.baseUrl = baseUrl;

        let patient = await Patient.findOne({ telegramChatId: chatId });
        debugInfo.patientExists = !!patient;

        if (!patient) {
            // Create a new patient with the provided chatId and language
            patient = new Patient({
                telegramChatId: chatId,
                language: language || 'english', // Default to English if no language provided
            });
            await patient.save();

            const registrationUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;
            debugInfo.registrationUrl = registrationUrl;

            return NextResponse.json({
                message: "Welcome! Please complete your registration using the link provided.",
                registrationUrl,
                debug: debugInfo, // Include debug info in the response
            });
        } else {
            // Update the patient's language if it's not already set
            if (!patient.language && language) {
                patient.language = language;
                await patient.save();
            }

            const patientDashboardUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;
            debugInfo.patientDashboardUrl = patientDashboardUrl;

            console.log("patient ID: " + patient._id )
            console.log("telegram chat ID =: " + chatId )
            return NextResponse.json({
                message: "Welcome back! Here's your patient info.",
                patientDashboardUrl,
                debug: debugInfo, // Include debug info in the response
            });
        }
    } catch (error) {
        console.error("Error in Telegram bot route:", error);

        if (error instanceof Error) {
            debugInfo.error = error.message;
        } else {
            debugInfo.error = String(error); // Fallback for unknown types
        }

        return NextResponse.json({ error: "Internal server error", debug: debugInfo }, { status: 500 });
    }
}