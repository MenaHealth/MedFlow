// app/api/auth/forgot-password/verify-security-answer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import dbConnect from '@/utils/database';

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { email, securityAnswer, securityQuestion } = await request.json();

        console.log('Received POST request for security answer verification:', { email, securityQuestion });

        if (!email || !securityAnswer || !securityQuestion) {
            return NextResponse.json({ error: 'Email, security question, and answer are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const selectedQuestion = user.securityQuestions.find(q => q.question === securityQuestion);

        if (!selectedQuestion) {
            return NextResponse.json({ error: 'Security question not found' }, { status: 400 });
        }

        const isAnswerValid = await bcrypt.compare(securityAnswer, selectedQuestion.answer);

        if (!isAnswerValid) {
            return NextResponse.json({ error: 'Incorrect security answer' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Security answer verified successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error verifying security answer:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}