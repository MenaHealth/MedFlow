// app/api/telegram-bot/route.ts

import { NextResponse } from 'next/server';
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const authHeader = request.headers.get('Authorization');
        const providedKey = authHeader ? decodeURIComponent(authHeader.split(' ')[1]) : null;
        const expectedKey = process.env.NODE_ENV === 'development'
            ? process.env.DEV_TELEGRAM_BOT_KEY
            : process.env.PROD_TELEGRAM_BOT_KEY;

        if (providedKey !== expectedKey) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { chatId, firstName, lastName } = await request.json();
        const baseUrl = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/+$/, "");

        let patient = await Patient.findOne({ telegramChatId: chatId });

        if (!patient) {
            patient = new Patient({
                telegramChatId: chatId,
                firstName: firstName || 'Telegram',
                lastName: lastName || 'Patient',
            });
            await patient.save();

            const registrationUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;
            const personalizedMessage = firstName
                ? `Welcome, ${firstName}! Please complete your registration using the link provided.`
                : "Welcome! Please complete your registration using the link provided.";

            return NextResponse.json({
                message: personalizedMessage,
                registrationUrl,
            });
        } else {
            const patientDashboardUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;
            const personalizedMessage = firstName
                ? `Welcome back, ${firstName}! Here's your patient dashboard.`
                : "Welcome back! Here's your patient info.";

            return NextResponse.json({
                message: personalizedMessage,
                patientDashboardUrl,
            });
        }
    } catch (error) {
        console.error("Error in Telegram bot route:", error);

        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}