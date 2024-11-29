// app/api/telegram-bot/route.ts

import { NextResponse } from 'next/server';
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { chatId, firstName, lastName } = await request.json();

        const baseUrl = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/+$/, "");

        // Check if this is a new user
        let patient = await Patient.findOne({ telegramChatId: chatId });

        if (!patient) {
            patient = new Patient({
                telegramChatId: chatId,
                firstName: firstName || 'Telegram',
                lastName: lastName || 'Patient',
            });
            await patient.save();

            // Generate a unique registration URL
            const registrationUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;
            console.log("Generated Registration URL:", registrationUrl);

            const personalizedMessage = firstName
                ? `Welcome, ${firstName}! Please complete your registration using the link provided.`
                : "Welcome! Please complete your registration using the link provided.";

            console.log("Generated personalized message:", personalizedMessage); // Log the message

            return NextResponse.json({
                message: personalizedMessage,
                registrationUrl
            });
        } else {
            // For existing users, generate a link to their patient dashboard
            const patientDashboardUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;
            console.log("Generated Patient Dashboard URL:", patientDashboardUrl);

            console.log("Received payload:", { chatId, firstName, lastName });
            const personalizedMessage = firstName
                ? `Welcome back, ${firstName}! Here's your patient dashboard.`
                : "Welcome back! Here's your patient info.";
            console.log("Generated personalized message:", personalizedMessage);

            return NextResponse.json({
                message: personalizedMessage,
                patientDashboardUrl
            });
        }
    } catch (error) {
        console.error("Error in Telegram bot route:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}