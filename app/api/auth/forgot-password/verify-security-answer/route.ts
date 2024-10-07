// app/api/auth/forgot-password/verify-security-answer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import dbConnect from '@/utils/database';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest): Promise<NextResponse> {
    await dbConnect();

    try {
        const { email, securityAnswer, questionId } = await request.json();

        console.log('Received security answer verification request:', { email, questionId });

        if (!email || !securityAnswer || !questionId) {
            console.error('Missing email, security answer, or question ID in request');
            return NextResponse.json({ success: false, error: 'Email, security answer, and question ID are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.error(`User with email ${email} not found`);
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const selectedQuestion = user.securityQuestions.find((q: { _id: string; question: string; answer: string }) => q._id.toString() === questionId);

        if (!selectedQuestion) {
            console.error('Security question not found for user');
            return NextResponse.json({ success: false, error: 'Security question not found' }, { status: 400 });
        }

        console.log('Verifying security answer...');
        console.log('Expected question:', selectedQuestion.question);
        console.log('Provided answer (first 3 characters):', securityAnswer.slice(0, 3) + '...');
        console.log('Expected answer hash:', selectedQuestion.answer);

        const trimmedAnswer = securityAnswer.trim().toLowerCase();
        const isAnswerValid = await bcrypt.compare(trimmedAnswer, selectedQuestion.answer);

        console.log('Is answer valid?', isAnswerValid);

        if (!isAnswerValid) {
            console.error('Incorrect security answer');
            return NextResponse.json({ success: false, error: 'Incorrect security answer' }, { status: 400 });
        }

        // Generate a JWT token for password reset, expires in 15 minutes
        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' }
        );

        console.log('Security answer verified successfully, JWT token generated');

        return NextResponse.json({ success: true, token }, { status: 200 });
    } catch (error) {
        console.error('Error verifying security answer:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}