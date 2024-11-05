import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Check if this is a request from Twilio (incoming message) or from the client (sending a message)
    if (req.body.Body && req.body.From) {
      // This is an incoming message from Twilio
      const incomingMessage = req.body.Body;
      const fromNumber = req.body.From;

      console.log(`Received message from ${fromNumber}: ${incomingMessage}`);

      // Optionally, send an automated response back to the sender
      try {
        const response = await client.messages.create({
          body: `Thank you for your message: "${incomingMessage}"`,
          from: 'whatsapp:+14155238886', // Twilio's WhatsApp sandbox number
          to: fromNumber,
        });

        console.log("Auto-reply sent:", response.sid);
        res.status(200).json({ success: true });
      } catch (error) {
        console.error("Error sending auto-reply:", error);
        res.status(500).json({ success: false, error: error.message });
      }

    } else if (req.body.to && req.body.message) {
      const { to, message } = req.body;

      try {
        const response = await client.messages.create({
          body: message,
          from: 'whatsapp:+14155238886', // Twilio's WhatsApp sandbox number
          to: `whatsapp:${to}`,
        });

        console.log("Message sent:", response.sid);
        res.status(200).json({ success: true, sid: response.sid });
      } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, error: error.message });
      }

    } else {
      res.status(400).json({ success: false, error: "Invalid request payload" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).send('Method Not Allowed');
  }
}
