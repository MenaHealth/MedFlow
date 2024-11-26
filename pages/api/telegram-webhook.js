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

    const { chatId, accessHash, message } = req.body;

    if (!chatId || !accessHash || !message) {
        console.error("[Telegram Webhook] Error: Missing chat ID, access hash, or message.");
        return res.status(400).json({ error: "Chat ID, access hash, and message are required" });
    }

    try {
        if (!client.connected) {
            console.log("[Telegram Webhook] Connecting Telegram Client...");
            await client.connect();
        }
        console.log("[Telegram Webhook] Telegram client connected!");

        console.log("[Telegram Webhook] Sending message:", message);
        const response = await client.invoke({
            _: "messages.sendMessage",
            peer: {
                _: "inputPeerUser",
                user_id: chatId, // Use chat ID from request
                access_hash: accessHash, // Use access hash from request
            },
            message,
            random_id: BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)),
        });

        console.log("[Telegram Webhook] Message Sent Response:", response);

        res.status(200).json({ success: true, response });
    } catch (error) {
        console.error("[Telegram Webhook] Error sending Telegram message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}