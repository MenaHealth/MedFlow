// app/api/auth/forgot-password/reset-password/route.ts
import { NextResponse } from 'next/server';
import User from '@/models/user';
import dbConnect from '@/utils/database';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const url = new URL(request.url);
        const email = url.searchParams.get('email');

        if (!email) {
            console.error('Email is missing in the request');
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.error(`User not found with email: ${email}`);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!user.securityQuestions || user.securityQuestions.length === 0) {
            console.error(`No security questions found for user with email: ${email}`);
            return NextResponse.json({ error: 'No security questions found for this user' }, { status: 400 });
        }

        const randomIndex = Math.floor(Math.random() * user.securityQuestions.length);
        const selectedQuestion = user.securityQuestions[randomIndex];

        console.log('Selected security question:', selectedQuestion);

        return NextResponse.json({
            question: selectedQuestion.question,
            questionId: selectedQuestion._id
        }, { status: 200 });
    } catch (error) {
        console.error('Error retrieving user or security question:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}