// utils/email.ts
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
            scope: 'https://graph.microsoft.com/.default',  // For Graph API usage
        };

        const result = await oauth2Client.getToken(tokenParams);
        return result.token.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
};

const sendGraphEmail = async (email: string, firstName: string, lastName: string, accountType: string) => {
    try {
        const accessToken = await getAccessToken();

        // Customize the greeting based on accountType
        let greeting;
        if (accountType === 'Doctor') {
            greeting = `Hello Dr. ${lastName},`;
        } else {
            greeting = `Hello ${firstName},`;
        }

        const mailBody = {
            message: {
                subject: 'Welcome to MedFlow',
                body: {
                    contentType: 'Text',
                    content: `${greeting}

Thank you for signing up for MedFlow!

We're excited to have you on board. Your account has been created successfully.

If you have any questions or need assistance, please don't hesitate to contact our support team.

Best regards,
The MedFlow Team`,
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

export { sendGraphEmail };