// utils/emails/user-signup.ts
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

const sendWelcomeEmail = async (email: string, firstName: string, lastName: string, accountType: string) => {
    try {
        const accessToken = await getAccessToken();

        // Customize the greeting based on accountType
        let greeting;
        if (accountType === 'Doctor-Pending') {
            greeting = `Hello Dr. ${lastName},`;
        } else {
            greeting = `Hello ${firstName},`;
        }

        // HTML email template with inline CSS for styling
        const mailBody = {
            message: {
                subject: 'Welcome to MedFlow',
                body: {
                    contentType: 'HTML',  // Use HTML content
                    content: `
                        <div style="background-color: #120f0b; padding: 20px; color: #ffffff;">
                            <h3 style="color: #ff5722; background-color: #ffffff; padding: 10px 20px; border-radius: 5px;">
                                ${greeting}
                            </h3>
                            <p style="color: #ffffff; font-size: 16px; line-height: 1.6;">
                                Thank you for signing up for MedFlow!<br><br>
                                We're excited to have you on board. Your account has been created successfully.<br><br>
                                Your account is pending administrator approval. You will receive a confirmation email once you've been authorized.<br><br>
                                <strong>Best regards,</strong><br>
                                <strong>The MedFlow Team</strong>
                            </p>
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

export { sendWelcomeEmail };