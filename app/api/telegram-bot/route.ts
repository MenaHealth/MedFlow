// app/api/telegram-bot/route.ts

import { NextResponse } from 'next/server';
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { chatId } = await request.json();

        // Ensure no trailing slash in the base URL
        const baseUrl = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/+$/, "");

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
            const registrationUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;
            console.log("Generated Registration URL:", registrationUrl);

            return NextResponse.json({
                message: "Welcome! Please complete your registration using the link provided.",
                registrationUrl
            });
        } else {
            // For existing users, generate a link to their patient dashboard
            const patientDashboardUrl = `${baseUrl}//new-patient/telegram/${patient._id}`;
            console.log("Generated Patient Dashboard URL:", patientDashboardUrl);

            return NextResponse.json({
                message: "Welcome back! Here's your patient dashboard.",
                patientDashboardUrl
            });
        }
    } catch (error) {
        console.error("Error in Telegram bot route:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}