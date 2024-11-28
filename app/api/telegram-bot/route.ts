// app/api/telegram-bot/route.ts

import { NextResponse } from 'next/server';
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { chatId } = await request.json();

        // Check if this is a new user
        let patient = await Patient.findOne({ telegramChatId: chatId });

        if (!patient) {
            // Create a new patient with minimal information
            patient = new Patient({
                telegramChatId: chatId,
                firstName: 'Telegram User', // Placeholder name
            });
            await patient.save();

            // Generate a unique registration URL
            const registrationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/register/${patient._id}`;

            // In a real-world scenario, you would send this URL to the user via Telegram API
            console.log(`Sending registration URL to ${chatId}: ${registrationUrl}`);

            return NextResponse.json({
                message: "Welcome! Please complete your registration using the link provided.",
                registrationUrl
            });
        } else {
            // Handle existing user interaction
            return NextResponse.json({
                message: "Welcome back! How can I assist you today?",
                patientId: patient._id
            });
        }
    } catch (error) {
        console.error("Error in Telegram bot route:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


