export default function handler(req, res) {
    if (req.method === 'POST') {
        const incomingMessage = req.body.Body;
        const fromNumber = req.body.From;

        console.log(`Received message from ${fromNumber}: ${incomingMessage}`);

        // Here, send the message data back to the client
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            from: fromNumber,
            message: incomingMessage,
        });
    } else {
        res.status(405).send('Method Not Allowed');
    }
}