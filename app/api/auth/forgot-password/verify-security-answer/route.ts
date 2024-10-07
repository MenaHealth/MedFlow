// app/api/auth/forgot-password/verify-security-answer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user';
import dbConnect from '@/utils/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest): Promise<NextResponse> {
    await dbConnect();

    const { email, securityAnswer, securityQuestion }: { email: string; securityAnswer: string; securityQuestion: string } = await request.json();

    console.log('Received security answer verification request:', { email, securityQuestion });

    if (!email || !securityAnswer || !securityQuestion) {
        console.error('Missing email, security answer, or security question in request');
        return NextResponse.json({ success: false, error: 'Email, security answer, and security question are required' }, { status: 400 });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.error(`User with email ${email} not found`);
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const securityQuestionData = user.securityQuestions.find((question: { question: string }) => question.question === securityQuestion);
        if (!securityQuestionData) {
            console.error(`Security question not found for user with email ${email}`);
            return NextResponse.json({ success: false, error: 'Security question not found' }, { status: 404 });
        }

        console.log('Verifying security answer...');
        console.log('Expected question:', securityQuestionData.question);
        console.log('Provided answer:', securityAnswer);
        console.log('Expected answer hash:', securityQuestionData.answer);

        // Logging hash generation and comparison process
        const isValid = await bcrypt.compare(securityAnswer, securityQuestionData.answer);
        console.log(`bcrypt.compare(securityAnswer, securityQuestionData.answer) result: ${isValid}`);
        console.log(`Plain answer provided: ${securityAnswer}`);
        console.log(`Stored answer hash: ${securityQuestionData.answer}`);

        if (!isValid) {
            console.error('Incorrect security answer');
            return NextResponse.json({ success: false, error: 'Incorrect security answer' }, { status: 400 });
        }

        // Generate a JWT token
        const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
            expiresIn: '15m',
        });

        console.log('Security answer verified successfully');
        return NextResponse.json({ success: true, token }, { status: 200 });
    } catch (error) {
        console.error('Error verifying security answer:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}