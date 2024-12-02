// utils/telegram/patientHelpers.ts

import Patient from "@/models/patient";
import TelegramThread from "@/models/telegramThread";
import { sendPatientRegistrationMessage, getSubmissionMessage } from "@/utils/telegram/signupConfirmation";

export async function createOrGetPatient(chatId: string, language: string, sendMessage: boolean = false) {
    const thread = await TelegramThread.findOne({ chatId });

    if (thread) {
        if (sendMessage) {
            const message = getSubmissionMessage(language || "english");
            await sendPatientRegistrationMessage(chatId, message);
        }
        return thread.patientId;
    } else {
        // Create a new patient
        const newPatient = new Patient({
            telegramChatId: chatId,
            language,
        });
        await newPatient.save();

        // Create a new thread
        const newThread = new TelegramThread({
            chatId,
            participants: [chatId],
            patientId: newPatient._id,
        });
        await newThread.save();

        if (sendMessage) {
            const message = getSubmissionMessage(language || "english");
            await sendPatientRegistrationMessage(chatId, message);
        }

        return newPatient._id;
    }
}