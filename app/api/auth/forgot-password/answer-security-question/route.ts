// app/api/auth/forgot-password/get-security-questions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user';
import dbConnect from '@/utils/database';

export async function GET(request: NextRequest) {
    await dbConnect();

    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
        return NextResponse.json({error: 'Email is required'}, {status: 400});
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!user.securityQuestions || user.securityQuestions.length === 0) {
            return NextResponse.json({ error: 'Password reset with security questions is not possible with this account' }, { status: 400 });
        }

        const randomIndex = Math.floor(Math.random() * user.securityQuestions.length);
        const selectedQuestion = user.securityQuestions[randomIndex];

        return NextResponse.json({ question: selectedQuestion.question }, { status: 200 });
    } catch (error) {
        console.error('Error retrieving user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}