// pages/api/viber/viber-messages.js
import { Bot, Events, Message } from 'viber-bot';
import { TextMessage } from 'viber-bot/messages';
import { NextApiRequest, NextApiResponse } from 'next';


const bot = new Bot({
    authToken: process.env.VIBER_AUTH_TOKEN, 
    name: "MedFlow Bot",
    avatar: "https://avatar.com/avatar.png", 
});


bot.on(Events.MESSAGE_RECEIVED, (message, response) => {
    console.log(`Received message: ${message.text}`);
    response.send(new TextMessage("Thanks for your message!"));
});

bot.on(Events.SUBSCRIBED, (response) => {
    console.log(`User subscribed: ${response.userProfile.name}`);

    response.send(new TextMessage("Welcome to MedFlow!"));
});

export default function handler(req, res) {
    if (req.method === 'POST') {
        bot.middleware()(req, res);
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).send('Method Not Allowed');
    }
}
