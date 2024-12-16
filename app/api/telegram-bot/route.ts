// app/api/telegram-bot/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import Patient from '@/models/patient';
import { validateApiKey } from '@/utils/telegram/validateApiKey';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { chatId, language } = await request.json();

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

        let patient = await Patient.findOne({ telegramChatId: chatId });

        if (!patient) {
            console.log('No patient found. Creating new patient.');
            patient = new Patient({
                telegramChatId: chatId,
                language: language || 'english',
            });
            await patient.save();

            const registrationUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;
            return NextResponse.json({ message: 'Patient created', registrationUrl });
        }

        console.log('Patient found. Returning existing patient data.');
        const patientDashboardUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;
        return NextResponse.json({ message: 'Patient found', patientDashboardUrl });
    } catch (error) {
        console.error('Error in Telegram bot route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}