// utils/telegram/signupConfirmation.ts
import TelegramBot from "node-telegram-bot-api";

// Configure Telegram Bot
const botToken = process.env.NODE_ENV === "development"
    ? process.env.TELEGRAM_BOT_TOKEN_DEV
    : process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(botToken!, { polling: false });

// Translations for submission message
const submissionMessages = {
    english: "You have successfully submitted your patient registration to MENA Health. A member of our medical team will contact you as soon as possible.",
    arabic: "لقد أكملت تسجيل المريض بنجاح لدى مينا هيلث. سيتواصل معك أحد أعضاء فريقنا الطبي في أقرب وقت ممكن.",
    farsi: "شما فرم ثبت نام بیمار را با موفقیت به MENA Health ارسال کرده‌اید. یکی از اعضای تیم پزشکی ما در اسرع وقت با شما تماس خواهد گرفت.",
    pashto: "تاسو په بریالیتوب سره خپل د ناروغ د راجستریشن فارم MENA روغتیا ته سپارلی. زموږ د طبي ټیم غړی به ژر تر ژره له تاسو سره اړیکه ونیسي.",
};

export function getSubmissionMessage(language: string): string {
    const message = submissionMessages[language as keyof typeof submissionMessages];
    if (!message) {
        console.warn(`Language not found: "${language}". Falling back to English.`);
    }
    return message || submissionMessages.english;
}

// Function to send a Telegram message
export async function sendPatientRegistrationMessage(chatId: string, message: string): Promise<void> {
    if (!chatId || !message) {
        console.error(`Invalid input: chatId=${chatId}, message=${message}`);
        return;
    }

    try {
        await bot.sendMessage(chatId, message);
        console.log(`Message sent to chat ID ${chatId}`);
    } catch (error) {
        console.error(`Failed to send Telegram message to chat ID ${chatId}:`, error);
    }
}