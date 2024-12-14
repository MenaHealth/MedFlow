// app/api/telegram-bot/[telegramChatId]/new-patient/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";
import { getRegistrationLinkMessage } from "@/utils/telegram/registrationLinkMessage";
import TelegramBot from "node-telegram-bot-api";

export async function POST(request: Request, { params }: { params: { telegramChatId: string } }) {
    try {
        await dbConnect();

        const { telegramChatId } = params;
        const { language } = await request.json();


        if (!telegramChatId) {
            return NextResponse.json({ error: "Telegram Chat ID is required" }, { status: 400 });
        }

        if (!language) {
            return NextResponse.json({ error: "Invalid language" }, { status: 400 });
        }

        // Check if the patient already exists
        let patient = await Patient.findOne({ telegramChatId });
        if (!patient) {
            patient = new Patient({
                telegramChatId,
                language,
                hasSubmittedInfo: false,
            });
            await patient.save();
            console.log(`New patient created with ID: ${patient._id}`);
        }

        // Generate registration URL
        const baseUrl = process.env.NEXTAUTH_URL;
        const registrationUrl = `${baseUrl}/new-patient/telegram/${patient._id}`;

        // Validate bot token
        const botToken = process.env.TELEGRAM_BOT_TOKEN;

        if (!botToken) {
            throw new Error("Telegram bot token is not defined in environment variables.");
        }

        // Initialize Telegram Bot
        const bot = new TelegramBot(botToken);

        // Send registration message
        const registrationMessage = getRegistrationLinkMessage(language);
        await bot.sendMessage(telegramChatId, registrationMessage);
        await bot.sendMessage(telegramChatId, registrationUrl);

        return NextResponse.json({
            message: "Patient created successfully",
            registrationUrl,
            patient,
        });
    } catch (error) {
        console.error("Error creating patient:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}