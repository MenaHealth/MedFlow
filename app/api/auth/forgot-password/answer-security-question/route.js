// app/api/auth/forgot-password/answer-security-question/route.js
import User from '@/models/user';
import dbConnect from '@/utils/database';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    await dbConnect();

    const { email, securityAnswer } = await request.json();

    if (!email || !securityAnswer) {
        console.error('Missing email or security answer in request');
        return new Response(JSON.stringify({ success: false, error: 'Email and security answer are required' }), { status: 400 });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.error(`User with email ${email} not found`);
            return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
        }

        const question = user.securityQuestions.find(q => bcrypt.compareSync(securityAnswer, q.answer));

        if (!question) {
            console.warn(`Incorrect security answer provided for user with email ${email}`);
            return new Response(JSON.stringify({ success: false, error: 'Incorrect security answer' }), { status: 401 });
        }

        console.log(`Security question answered correctly for user with email ${email}`);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error validating security answer:', error);
        return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), { status: 500 });
    }
}