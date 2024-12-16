// utils/emails/forgot-password.ts
import fetch from 'node-fetch';
import { ClientCredentials } from 'simple-oauth2';

const clientId = process.env.OUTLOOK_CLIENT_ID;
const clientSecret = process.env.OUTLOOK_CLIENT_SECRET;
const tenantId = process.env.OUTLOOK_TENANT_ID;
const outlookEmail = process.env.OUTLOOK_EMAIL;

if (!clientId || !clientSecret || !tenantId || !outlookEmail) {
    console.error('Missing required environment variables');
    process.exit(1);
}

const oauth2Config = {
    client: {
        id: clientId,
        secret: clientSecret,
    },
    auth: {
        tokenHost: 'https://login.microsoftonline.com',
        tokenPath: `/${tenantId}/oauth2/v2.0/token`,
    },
};

const oauth2Client = new ClientCredentials(oauth2Config);

const getAccessToken = async () => {
    try {
        const tokenParams = {
            scope: 'https://graph.microsoft.com/.default',
        };

        const result = await oauth2Client.getToken(tokenParams);
        return result.token.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
};

const sendVerificationEmail = async (email: string, verificationCode: string) => {
    try {
        const accessToken = await getAccessToken();

        const mailBody = {
            message: {
                subject: 'Password Reset Verification Code',
                body: {
                    contentType: 'HTML',
                    content: `
                        <div style="font-family: Arial, sans-serif;">
                            <h3>Password Reset Request</h3>
                            <p>You have requested to reset your password. Please use the following verification code:</p>
                            <h2 style="color: #4A90E2;">${verificationCode}</h2>
                            <p>This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
                        </div>
                    `,
                },
                toRecipients: [
                    {
                        emailAddress: {
                            address: email,
                        },
                    },
                ],
            },
        };

        const response = await fetch(`https://graph.microsoft.com/v1.0/users/${outlookEmail}/sendMail`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mailBody),
        });

        if (!response.ok) {
            throw new Error(`Failed to send email. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export { sendVerificationEmail };
















