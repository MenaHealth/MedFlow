// app/api/auth/signup/email-check/route.ts
export const dynamic = 'force-dynamic';

import User from '@/models/user';
import dbConnect from '@/utils/database';

export async function GET(request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
        }

        // Convert the email to lowercase for case-insensitive comparison
        const lowercaseEmail = email.toLowerCase();

        // Use a case-insensitive regex to search for the email
        const emailRegex = new RegExp(`^${lowercaseEmail}$`, 'i');
        const user = await User.findOne({ email: emailRegex });

        if (user) {
            return new Response(JSON.stringify({ message: 'Account already exists. Please login.' }), { status: 409 });
        }

        return new Response(JSON.stringify({ message: 'Email available for signup.' }), { status: 200 });

    } catch (error) {
        console.error('Error checking email:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}