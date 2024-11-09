import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Check if the request is an incoming message from Twilio
        if (req.body.Body && req.body.From) {
            // Handle incoming message
            const incomingMessage = req.body.Body;
            const fromNumber = req.body.From;

            console.log(`Received incoming WhatsApp message from ${fromNumber}: ${incomingMessage}`);

            res.status(200).json({ success: true });
        } else if (req.body.to && req.body.message) {
            // Handle outgoing message
            const { to, message } = req.body;

            console.log(`Sending outgoing message to ${to}: ${message}`);

            try {
                await client.messages.create({
                    body: message,
                    from: 'whatsapp:+14155238886',
                    to: `whatsapp:${to}`,
                });
                res.status(200).json({ success: true });
            } catch (error) {
                console.error("Error sending outgoing message:", error);
                res.status(500).json({ success: false, error: error.message });
            }
        } else {
            res.status(400).json({ success: false, error: "Invalid request format" });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).send('Method Not Allowed');
    }
};

