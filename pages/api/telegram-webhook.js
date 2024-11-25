export default async function handler(req, res) {
    const { message } = req.body;

    if (message) {
        const chatId = message.chat.id; // Get patient's Telegram chat_id
        const text = message.text; // Message content

        if (text === '/start') {
            // Save chatId in your database and link it to the patient
            await updatePatientChatIdByPhone(message.chat.id, 'PATIENT_PHONE_NUMBER'); // Implement this logic
            return res.status(200).send('Chat ID saved');
        }

        // Handle incoming messages
        return res.status(200).send('Message received');
    }

    return res.status(400).send('Invalid request');
}
