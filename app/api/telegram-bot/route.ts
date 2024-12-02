// app/api/telegram-bot/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import Patient from '@/models/patient';
import { validateApiKey } from '@/utils/telegram/validateApiKey';

export async function POST(request: Request) {
    await dbConnect();

    const authHeader = request.headers.get('Authorization');

    // Validate the API key without passing `expectedKey`
    if (!validateApiKey(authHeader)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { chatId, language } = await request.json();

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

        let patient = await Patient.findOne({ telegramChatId: chatId });

        if (!patient) {
            patient = new Patient({
                telegramChatId: chatId,
                language: language || 'english',
            });
            await patient.save();

            const registrationUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;
            return NextResponse.json({
                messageKey: 'welcome',
                registrationUrl,
            });
        } else {
            if (language && patient.language !== language) {
                patient.language = language;
                await patient.save();
            }

            const patientDashboardUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;
            return NextResponse.json({
                messageKey: 'registration_completed',
                patientDashboardUrl,
            });
        }
    } catch (error) {
        console.error('Error in Telegram bot route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}