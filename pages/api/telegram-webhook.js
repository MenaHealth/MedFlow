import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message } = req.body;

        if (message && message.text) {
            const chatId = message.chat.id;
            const userMessage = message.text;

            console.log(`Received message from ${chatId}: ${userMessage}`);

            const reply = `You said: ${userMessage}`;
            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: reply }),
            });
        }

        res.status(200).send("OK");
    } else {
        res.status(405).send("Method Not Allowed");
    }
}
