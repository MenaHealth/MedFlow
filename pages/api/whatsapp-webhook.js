import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        if (req.body.Body && req.body.From) {
            // Handle incoming message from Twilio
            const incomingMessage = req.body.Body;
            const fromNumber = req.body.From;

            console.log(`Received message from ${fromNumber}: ${incomingMessage}`);

            try {
                await client.messages.create({
                    body: `Thank you for your message: "${incomingMessage}"`,
                    from: 'whatsapp:+14155238886', // Twilio's WhatsApp sandbox number
                    to: fromNumber,
                });

                res.status(200).json({ success: true });
            } catch (error) {
                console.error("Error sending auto-reply:", error);
                res.status(500).json({ success: false, error: error.message });
            }
        } else {
            // Handle outgoing message
            const { to, message } = req.body;

            try {
                await client.messages.create({
                    body: message,
                    from: 'whatsapp:+14155238886',
                    to: `whatsapp:${to}`,
                });
                res.status(200).json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).send('Method Not Allowed');
    }
};

