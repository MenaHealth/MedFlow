// app/api/auth/signup/email-check/route.js
import User from '@/models/user'; // Import your User model
import dbConnect from '@/utils/database'; // Import your database connection utility

export async function GET(request) {
    // Connect to the database
    await dbConnect();

    try {
        // Extract the email from query parameters
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        // Check if email is provided
        if (!email) {
            return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
        }

        // Search for an existing user with the provided email
        const user = await User.findOne({ email });

        // If a user with the provided email exists, return a response indicating that
        if (user) {
            return new Response(JSON.stringify({ message: 'Account already exists. Please login.' }), { status: 409 });
        }

        // If no user is found, return a response indicating the email is available
        return new Response(JSON.stringify({ message: 'Email available for signup.' }), { status: 200 });

    } catch (error) {
        console.error('Error checking email:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}