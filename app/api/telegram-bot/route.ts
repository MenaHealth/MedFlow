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

        const { chatId, firstName, lastName } = await request.json();
        debugInfo.chatId = chatId;
        debugInfo.firstName = firstName;
        debugInfo.lastName = lastName;

        const baseUrl = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/+$/, "");
        debugInfo.baseUrl = baseUrl;

        let patient = await Patient.findOne({ telegramChatId: chatId });
        debugInfo.patientExists = !!patient;

        if (!patient) {
            patient = new Patient({
                telegramChatId: chatId,
                firstName: firstName || 'Telegram',
                lastName: lastName || 'Patient',
            });
            await patient.save();

            const registrationUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;
            debugInfo.registrationUrl = registrationUrl;

            const personalizedMessage = firstName
                ? `Welcome, ${firstName}! Please complete your registration using the link provided.`
                : "Welcome! Please complete your registration using the link provided.";

            debugInfo.personalizedMessage = personalizedMessage;

            return NextResponse.json({
                message: personalizedMessage,
                registrationUrl,
                debug: debugInfo, // Include debug info in the response
            });
        } else {
            const patientDashboardUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;
            debugInfo.patientDashboardUrl = patientDashboardUrl;

            const personalizedMessage = firstName
                ? `Welcome back, ${firstName}! Here's your patient dashboard.`
                : "Welcome back! Here's your patient info.";

            debugInfo.personalizedMessage = personalizedMessage;

            return NextResponse.json({
                message: personalizedMessage,
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