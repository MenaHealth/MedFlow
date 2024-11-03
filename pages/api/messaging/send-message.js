import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        let { to, message } = req.body;

        // Ensure `to` is formatted correctly
        to = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

        try {
            const twilioMessage = await client.messages.create({
                body: message,
                from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
                to: to, // Updated to use the prefixed number
            });
            res.status(200).json({ success: true, sid: twilioMessage.sid });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
