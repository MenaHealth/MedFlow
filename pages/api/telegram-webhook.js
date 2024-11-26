const sendTelegramMessage = async (chatId, text) => {
    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text }),
        });

        const result = await response.json();
        console.log("Telegram API Response:", result);

        if (!response.ok) {
            throw new Error(result.description || 'Failed to send Telegram message');
        }

        return result;
    } catch (error) {
        console.error("Error sending Telegram message:", error.message);
        throw error;
    }
};

export default async function handler(req, res) {
    try {
        console.log("Incoming webhook request:", req.body);

        const { message } = req.body;

        if (message) {
            const chatId = message.chat.id;
            const text = message.text;

            console.log("Received message:", text, "from chat ID:", chatId);

            if (text === '/start') {
                console.log("Saving chat ID:", chatId);
                return res.status(200).send('Chat ID saved');
            }

            console.log("Forwarding message to Telegram...");
            try {
                const telegramResponse = await sendTelegramMessage(chatId, `Forwarded: ${text}`);
                console.log("Telegram message sent:", telegramResponse);
                return res.status(200).send('Message received and forwarded to Telegram');
            } catch (err) {
                console.error("Error sending Telegram message:", err.message);
                return res.status(500).send('Failed to forward message to Telegram');
            }
        }

        console.error("Invalid request: No message object found");
        return res.status(400).send('Invalid request');
    } catch (error) {
        console.error("Error in webhook handler:", error);
        return res.status(500).send('Internal server error');
    }
}
