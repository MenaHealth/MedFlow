import TelegramBot from 'node-telegram-bot-api';

const botToken = process.env.NODE_ENV === 'development'
    ? process.env.TELEGRAM_BOT_TOKEN_DEV
    : process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(botToken!, { polling: false });

export async function sendPatientRegistrationMessage(chatId: string, message: string) {
    try {
        await bot.sendMessage(chatId, message);
        console.log(`Message sent to chat ID ${chatId}`);
    } catch (error) {
        console.error(`Failed to send Telegram message to chat ID ${chatId}:`, error);
    }
}

const messages = {
    english: "Your information has been received. Thank you for submitting.",
    arabic: "تم استلام معلوماتك. شكرا لك على التقديم.",
    farsi: "اطلاعات شما دریافت شد. با تشکر از ارسال شما.",
    pashto: "ستاسو معلومات ترلاسه شول. د سپارلو لپاره مننه.",
};

export function getSubmissionMessage(language: string): string {
    return messages[language as keyof typeof messages] || messages.english;
}

