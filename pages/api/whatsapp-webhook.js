import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        if (req.body.Body && req.body.From) {
            const incomingMessage = req.body.Body;
            const fromNumber = req.body.From;

            console.log(`Received incoming WhatsApp message from ${fromNumber}: ${incomingMessage}`);

            try {
                await client.messages.create({
                    body: `Thank you for your message: "${incomingMessage}"`,
                    from: 'whatsapp:+14155238886',
                    to: fromNumber,
                });

                res.status(200).json({ success: true });
            } catch (error) {
                console.error("Error sending auto-reply:", error);
                res.status(500).json({ success: false, error: error.message });
            }
        } else if (req.body.to && req.body.message) {
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
