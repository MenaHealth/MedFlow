// /Users/kamasine/jenin/MedFlow/pages/api/telegram-webhook.js
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
        console.log("Incoming request body:", JSON.stringify(req.body, null, 2)); // Log the full request body
        const { message } = req.body;

        if (!message || !message.chat || !message.chat.id) {
            console.error("Invalid request structure:", req.body);
            return res.status(400).json({ error: "Invalid request structure" });
        }

        const chatId = message.chat.id;
        const text = message.text;

        console.log(`Received message: "${text}" from chat ID: ${chatId}`);

        if (text === '/start') {
            console.log("Saving chat ID:", chatId);

            await saveChatIdToPatient(chatId, 'PATIENT_IDENTIFIER'); 
        
            return res.status(200).send('Chat ID saved');
        }
        

        console.log("Forwarding message to Telegram...");
        const telegramResponse = await sendTelegramMessage(chatId, `Forwarded: ${text}`);
        console.log("Telegram message sent:", telegramResponse);

        return res.status(200).json({ message: 'Message received and forwarded to Telegram' });
    } catch (error) {
        console.error("Error in webhook handler:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
