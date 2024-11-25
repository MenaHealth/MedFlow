export default async function handler(req, res) {
    console.log('Request body:', req.body); 

    const { message } = req.body;

    if (message) {
        console.log('Message received:', message);

        const chatId = message.chat.id; 
        const text = message.text; 

        if (text === '/start') {
            console.log('Start command received, chatId:', chatId);

            try {
               
                await updatePatientChatIdByPhone(chatId, 'PATIENT_PHONE_NUMBER'); 
                return res.status(200).send('Chat ID saved');
            } catch (error) {
                console.error('Error saving chat ID:', error);
                return res.status(500).send('Failed to save chat ID');
            }
        }

        return res.status(200).send('Message received');
    }

    console.error('No message in request body');
    return res.status(400).send('Invalid request');
}
