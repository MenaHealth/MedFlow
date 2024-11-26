// pages/api/telegram-webhook.js


import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

const apiId = process.env.TELEGRAM_API_ID; // Your Telegram API ID
const apiHash = process.env.TELEGRAM_API_HASH; // Your Telegram API Hash
const stringSession = new StringSession(process.env.TELEGRAM_SESSION); // Use saved session string

const client = new TelegramClient(stringSession, parseInt(apiId), apiHash, {
    connectionRetries: 5,
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { phoneNumber, message } = req.body;

    console.log("[Telegram Webhook] Incoming Request Body:", req.body);

    if (!phoneNumber || !message) {
        console.error("[Telegram Webhook] Error: Missing phone number or message.");
        return res.status(400).json({ error: "Phone number and message are required" });
    }

    try {
        // Connect Telegram client using the saved session
        if (!client.connected) {
            console.log("[Telegram Webhook] Connecting Telegram Client...");
            await client.connect();
        }
        console.log("[Telegram Webhook] Telegram client connected!");

        // Fetch contacts
        console.log("[Telegram Webhook] Fetching contacts...");
        const contacts = await client.invoke({
            _: "contacts.getContacts",
            hash: 0,
        });

        console.log("[Telegram Webhook] Contacts fetched:", contacts);

        // Search for the user by phone number
        const user = contacts.users.find((u) => u.phone === phoneNumber.replace("+", ""));

        if (!user) {
            console.error("[Telegram Webhook] Error: User not found for phone number:", phoneNumber);
            return res.status(404).json({ error: "User not found for the given phone number." });
        }

        const chatId = user.id;

        // Log resolved chat ID
        console.log("[Telegram Webhook] Resolved Chat ID:", chatId);

        // Send message to the resolved chat ID
        console.log("[Telegram Webhook] Sending message:", message);
        const response = await client.sendMessage(chatId, {
            message,
        });

        console.log("[Telegram Webhook] Message Sent Response:", response);

        res.status(200).json({ success: true, response });
    } catch (error) {
        console.error("[Telegram Webhook] Error sending Telegram message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}