// utils/emails/user-approval.ts

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
        console.log('Fetching access token...');
        const tokenParams = {
            scope: 'https://graph.microsoft.com/.default',
        };

        const result = await oauth2Client.getToken(tokenParams);
        console.log('Access token fetched successfully.');
        return result.token.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
};

const sendApprovalEmail = async (email: string, firstName: string, lastName: string, accountType: string) => {
    try {
        const accessToken = await getAccessToken();
        console.log(`Sending approval email to: ${email}`);

        let greeting;
        if (accountType === 'Doctor') {
            greeting = `Hello Dr. ${lastName},`;
        } else {
            greeting = `Hello ${firstName},`;
        }

        const mailBody = {
            message: {
                subject: 'Account Approved - MedFlow',
                body: {
                    contentType: 'HTML',
                    content: `
                <div style="background-color: #120f0b; padding: 20px; color: #ffffff;">
                    <h3 style="color: #ff5722; background-color: #ffffff; padding: 10px 20px; border-radius: 5px;">
                        ${greeting}
                    </h3>
                    <p style="color: #ffffff; font-size: 16px; line-height: 1.6;">
                        Your account has been approved! You can now log in to your MedFlow account.<br><br>
                        Click the link below to log in:<br>
                        <a href="https://medflow-mena-health.vercel.app/auth/login" style="color: #ff5722;">Login to MedFlow</a><br><br>
                        If you have any questions or need assistance, feel free to reach out to our support team.<br><br>
                        <strong>Best regards,</strong><br>
                        <strong>The MedFlow Team</strong>
                    </p>
                </div>

                <style>
                    @keyframes dash {
                        from {
                            stroke-dashoffset: 1000;
                        }
                        to {
                            stroke-dashoffset: 0;
                        }
                    }
                </style>
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
            console.error(`Failed to send approval email. Status: ${response.status}`);
            throw new Error(`Failed to send approval email. Status: ${response.status}`);
        }

        console.log(`Approval email sent successfully to: ${email}`);
    } catch (error) {
        console.error('Error sending approval email:', error);
        throw error;
    }
};

export { sendApprovalEmail };