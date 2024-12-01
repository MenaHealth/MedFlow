// app/api/telegram-bot/[telegramChatId]/get/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";

export async function GET(request: Request, { params }: { params: { telegramChatId: string } }) {
    try {
        const { telegramChatId } = params;
        await dbConnect();

        if (!telegramChatId) {
            return NextResponse.json({ error: "Telegram Chat ID is required" }, { status: 400 });
        }

        const patient = await Patient.findOne({ telegramChatId });

        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        return NextResponse.json({ patient });
    } catch (error) {
        console.error("Error retrieving patient data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}