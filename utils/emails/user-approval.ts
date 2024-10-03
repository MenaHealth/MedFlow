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
                    <div style="margin-top: 20px;">
                        <!-- Embedded SVG with inline styles -->
                        <svg width="100%" height="100%" viewBox="0 0 540 540" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
                            <path d="M188.446,246.505c0,0 -10.31,4.616 -3.42,6.672c6.891,2.055 18.794,-6.475 18.794,-6.475c0,0 -2.538,-34.484 -2.998,-34.344c-0.177,0.054 -0.699,32.416 2.068,33.861c9.938,5.189 10.418,4.696 16.337,3.301c5.918,-1.395 2.851,-6.373 6.763,-4.981c3.912,1.392 6.339,5.031 -2.586,5.638c-8.925,0.607 -26.541,0.157 -15.208,-7.302c11.334,-7.459 18.61,-61.851 -1.566,-64.74c-20.175,-2.888 -19.344,10.604 -21.729,15.176c-2.385,4.572 -3.027,-3.54 -3.027,-8.813c0,-5.273 17.633,-44.964 38.813,0.858c21.181,45.823 -33.723,102.925 -41.262,11.333c-1.966,-23.888 18.678,-26.679 18.615,-35.347c-0.063,-8.667 0.467,-32.617 0.4,-41.292c-0.066,-8.675 -0.016,-19.592 7.759,-23.661c7.774,-4.069 12.622,-12.361 11.569,-5.625c-1.053,6.737 -6.369,18.138 -5.275,24.916c1.093,6.779 -0.747,11.049 3.147,13.504c3.895,2.454 12.706,2.716 12.523,7.967c-0.183,5.25 -7.463,10.475 -5.646,14.794c1.817,4.319 38.046,59.443 37.67,55.367c-0.377,-4.076 2.362,27.591 -0,22.496c-2.363,-5.095 0.281,-20.437 3.911,-31.747c3.63,-11.31 26.826,-88.047 31.253,-98.562c4.428,-10.514 7.537,-33.463 -12.651,-29.749c-20.188,3.715 -51.171,-8.034 -44.523,9.95c6.648,17.985 42.037,3.496 58.467,3.984c16.429,0.488 -29.534,104.708 -29.534,104.708c0,-0 -37.467,-112.115 -32.447,-114.219" style="fill:none;stroke:#ff5722;stroke-width:2px;"/>
                            
                            <path d="M159.256,139.868c0,0 23.995,99.029 17.245,130.132c-6.749,31.103 -31.338,-40.891 -22.807,-37.705c8.532,3.186 32.529,56.37 16.745,112.182c-15.784,55.812 7.126,86.702 0,87.226c-7.126,0.524 -39.71,17.861 -41.915,-6.053c-2.205,-23.914 -21.777,-215.959 16.995,-282.255c38.772,-66.296 40.514,-13.631 88.979,-73.491c2.118,-2.616 7.67,-1.112 14.851,-1.7c11.741,-0.962 30.814,-1.47 45.274,1.384c7.526,1.485 22.696,15.623 25.121,23.937c1.729,5.929 3.794,23.191 -0.865,35.45c-0.695,1.83 -12.495,5.627 -13.729,7.284c-4.051,5.441 9.352,12.667 5.331,19.031c-31.222,49.417 -59.174,58.303 -53.097,92.234c12.099,67.554 -6.137,78.91 0,128.788c6.137,49.878 1.045,93.605 19.42,92.047c18.376,-1.559 64.054,-6.629 91.119,-23.876c9.505,-6.057 -8.213,3.56 -9.954,-5.699c-3.217,-17.106 6.792,-49.277 7.403,-54.293c0.341,-2.8 -9.125,54.931 -7.227,56.572c8.756,7.571 27.625,2.639 48.071,-0.368c20.447,-3.007 7.371,-58.557 11.747,-65.349c4.375,-6.791 -8.428,-188.573 -18.944,-211.506c-10.515,-22.933 -19.267,-64.564 -34.362,2.488c-12.788,56.802 3.889,21.479 10.165,2.206c0.812,-2.493 6.873,-25.803 8.308,-37.017c0.568,-4.43 -65.058,-41.089 -64.995,-41.598c0.109,-0.889 65.662,35.906 64.91,40.993c-1.495,10.107 -7.651,31.386 -8.992,35.47c-6.907,21.024 -23.086,83.619 -17.921,119.22c6.673,45.996 9.619,86.812 10.493,92.496c0.874,5.684 -1.57,9.275 -4.089,2.721c-2.518,-6.553 7.304,-10.354 -7.309,-105.619c-3.544,-23.105 31.004,-49.831 20.601,-20.667c-29.175,81.793 -19.998,5.157 -20.385,5.266c-0.746,0.21 8.017,-5.64 -6.918,-6.182c-22.672,-0.822 -32.777,1.526 -43.045,-0.878c-10.267,-2.404 -21.598,10.863 -19.979,-29.629c0.519,-12.98 -4.603,-35.375 3.512,-35.239c8.115,0.135 51.505,-1.679 52.646,-1.716c1.141,-0.037 8.873,-2.757 8.873,3.763c0,6.521 1.9,17.571 -9.621,17.955c-11.521,0.384 -77.015,0.322 -39.203,-0.954c37.812,-1.276 46.679,-1.141 46.242,1.67c-0.436,2.811 5.533,24.723 2.771,36.493c-2.762,11.77 4.978,10.085 4.639,16.263c-0.365,6.636 0.106,11.009 -0.133,13.855c-0.741,8.825 6.668,67.546 6.668,70.047c0,2.5 5.701,22.209 -0.023,22.768c-2.554,0.249 -20.315,-6.974 -32.511,-8.343c-1.706,-0.191 -4.263,-97.848 -2.706,-98.531c4.771,-2.097 4.729,98.591 2.706,98.531c-10.646,-0.313 -24.615,5.214 -23.833,11.635c1.895,15.552 38.002,2.66 53.161,-0.242c15.159,-2.902 -3.498,-2.842 -26.345,2.978c-22.848,5.819 -26.765,-0.539 -26.882,9.083c-0.117,9.623 -5.962,48.089 18.972,51.359c9.837,1.29 36.522,0.984 36.907,-6.75" style="fill:none;stroke:#ff5722;stroke-width:2px;"/>
                            <path d="M260.187,460.039c-0,-0 -11.859,11.993 -28.948,8.36c-17.089,-3.633 -57.495,-17.528 -59.536,-25.187c-2.04,-7.658 1.698,-18.028 1.698,-18.028c-0,-0 5.111,6.94 18.001,7.618c12.89,0.679 26.826,9.909 31.82,-12.889c4.994,-22.798 4.416,-37.453 4.416,-37.453c0,0 -3.05,-3.239 -25.696,-4.551c-22.646,-1.313 -20.897,-4.967 -26.908,-7.163c-6.011,-2.196 -3.647,-24.26 0.626,-21.303c4.272,2.958 47.629,8.407 48.926,12.322c1.297,3.914 3.051,1.391 2.606,11.17c-0.444,9.779 10.691,-19.147 -21.911,-16.901c-8.984,0.619 -23.501,-4.265 -23.859,-4.744c-1.008,-1.348 33.116,0.175 29.238,-11.321c-5.256,-15.582 -1.77,-21.441 -1.77,-36.094c0,-14.652 -2.666,-29.252 -2.666,-29.252" style="fill:none;stroke:#ff5722;stroke-width:2px;"/>
                        </svg>
                    </div>
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