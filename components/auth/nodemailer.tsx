// components/auth/nodemailer.tsx
import {AccessToken} from "simple-oauth2";

require('dotenv').config();
const nodemailer = require('nodemailer');
const { AuthorizationCode } = require('simple-oauth2');

// Set up your credentials
const clientId = process.env.OUTLOOK_CLIENT_ID!;
const clientSecret = process.env.OUTLOOK_CLIENT_SECRET!;
const tenantId = process.env.OUTLOOK_TENANT_ID!;
const outlookEmail = process.env.OUTLOOK_EMAIL!;
const redirectUri = process.env.OUTLOOK_REDIRECT_URI!;

const oauth2Config = {
  client: {
    id: clientId,
    secret: clientSecret,
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: `/${tenantId}/oauth2/v2.0/authorize`,
    tokenPath: `/${tenantId}/oauth2/v2.0/token`,
  },
};

// Initialize the OAuth2 library
const oauth2Client = new AuthorizationCode(oauth2Config);

// Obtain an access token
const tokenParams = {
  scope: 'https://outlook.office365.com/.default',
  redirect_uri: redirectUri,
};

// Typing for the token response
interface TokenResponse {
  token: {
    access_token: string;
  };
}

// Get the access token
const getAccessToken = async (): Promise<string> => {
  try {
    const accessTokenResponse: AccessToken = await oauth2Client.getToken(tokenParams);
    return accessTokenResponse.token.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
};

// Nodemailer transporter using OAuth2
const createTransporter = async () => {
  const accessToken = await getAccessToken();

  return nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
      type: 'OAuth2',
      user: outlookEmail,
      clientId: clientId,
      clientSecret: clientSecret,
      accessToken: accessToken,
    },
  });
};

// Function to send the email
const sendEmail = async (recipientEmail: string) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: outlookEmail,
      to: recipientEmail,
      subject: 'Email Validation',
      text: 'Please validate your email.',
      html: '<b>Please validate your email</b>',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendEmail };