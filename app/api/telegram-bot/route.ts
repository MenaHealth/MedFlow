// app/api/telegram-bot/route.ts

import { NextResponse } from 'next/server';
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";

export async function POST(request: Request) {
    const debugInfo: Record<string, any> = {};

    try {
        await dbConnect();

        const authHeader = request.headers.get('Authorization');
        const providedKey = authHeader ? decodeURIComponent(authHeader.split(' ')[1]) : null;
        const expectedKey = process.env.NODE_ENV === 'development'
            ? process.env.DEV_TELEGRAM_BOT_KEY
            : process.env.PROD_TELEGRAM_BOT_KEY;

        if (providedKey !== expectedKey) {
            debugInfo.error = "Unauthorized: Keys do not match";
            return NextResponse.json({ error: "unauthorized" }, { status: 401 });
        }

        const { chatId, language } = await request.json();
        debugInfo.chatId = chatId;
        debugInfo.language = language;

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

        let patient = await Patient.findOne({ telegramChatId: chatId });
        debugInfo.patientExists = !!patient;

        if (!patient) {
            patient = new Patient({
                telegramChatId: chatId,
                language: language || 'english',
            });
            await patient.save();

            const registrationUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;
            return NextResponse.json({
                messageKey: "welcome", // Translation key
                registrationUrl,
            });
        } else {
            if (language && patient.language !== language) {
                patient.language = language;
                await patient.save();
            }

            const patientDashboardUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;
            return NextResponse.json({
                messageKey: "registration_completed", // Translation key
                patientDashboardUrl,
            });
        }
    } catch (error) {
        console.error("Error in Telegram bot route:", error);
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}