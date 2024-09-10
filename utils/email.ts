import nodemailer from 'nodemailer';
import { ClientCredentials } from 'simple-oauth2';

const clientId = process.env.OUTLOOK_CLIENT_ID as string;
const clientSecret = process.env.OUTLOOK_CLIENT_SECRET as string;
const tenantId = process.env.OUTLOOK_TENANT_ID as string;
const outlookEmail = process.env.OUTLOOK_EMAIL as string;

console.log('Environment Variables:');
console.log('OUTLOOK_CLIENT_ID:', clientId);
console.log('OUTLOOK_CLIENT_SECRET:', clientSecret);
console.log('OUTLOOK_TENANT_ID:', tenantId);
console.log('OUTLOOK_EMAIL:', outlookEmail);

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

const getAccessToken = async (): Promise<string> => {
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

export async function sendWelcomeEmail(email: string) {
    try {
        console.log('Fetching access token...');
        const accessToken = await getAccessToken();

        console.log('Access token retrieved');

        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                type: 'OAuth2',
                user: outlookEmail,
                clientId: clientId,
                clientSecret: clientSecret,
                accessToken,
            },
        });

        const mailOptions = {
            from: outlookEmail,
            to: email,
            subject: 'Welcome to MenaHealth',
            text: `Thank you for signing up for MenaHealth!

We're excited to have you on board. Your account has been created successfully.

If you have any questions or need assistance, please don't hesitate to contact our support team.

Best regards,
The MenaHealth Team`,
        };

        console.log('Sending welcome email to:', email);

        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}