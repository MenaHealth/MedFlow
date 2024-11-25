import Patient from '../../../../models/patient';

export default async function handler(req, res) {
    const { message } = req.body;

    if (message && message.text === '/start') {
        const chatId = message.chat.id; 
        const phoneNumber = message.contact?.phone_number; 
        console.log('Received /start:', { chatId, phoneNumber });

        if (!phoneNumber) {
            return res.status(400).send('Phone number not provided.');
        }

        const patient = await Patient.findOneAndUpdate(
            { "phone.phoneNumber": phoneNumber }, 
            { $set: { telegramChatId: chatId } }, 
            { new: true } 
        );

        if (!patient) {
            return res.status(404).send('Patient not found for the provided phone number.');
        }

        console.log('Chat ID saved for patient:', patient);
        return res.status(200).send('Chat ID successfully linked to the patient.');
    }

    res.status(200).send('No /start command received.');
}
