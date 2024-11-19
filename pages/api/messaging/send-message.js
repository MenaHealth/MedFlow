import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log("Account SID:", accountSid);
console.log("Auth Token:", authToken);

const client = require('twilio')(accountSid, authToken);

export default async function handler(req, res) {
    if (!accountSid || !authToken) {
        return res.status(500).json({ error: "Twilio credentials not found." });
    }

    if (req.method === 'POST') {
        const { to, message } = req.body;
        try {
            const twilioMessage = await client.messages.create({
                body: message,
                from: 'whatsapp:+16822171910',
                to: `whatsapp:${to}`,
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


