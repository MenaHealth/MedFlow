// utils/telegram/signupConfirmation.ts
import TelegramBot from "node-telegram-bot-api";

// Configure Telegram Bot
const botToken = process.env.NODE_ENV === "development"
    ? process.env.TELEGRAM_BOT_TOKEN_DEV
    : process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(botToken!, { polling: false });

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