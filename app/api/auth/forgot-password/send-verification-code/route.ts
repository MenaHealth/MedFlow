/// app/api/auth/forgot-password/send-verification-code/route.ts

import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/utils/emails/forgot-password';
import User from '@/models/user';
import CryptoJS from 'crypto-js';
import dbConnect from "@/utils/database";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email } = await request.json();

        if (!email) {
            console.log('Forgot password: Email not provided');
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`Forgot password: User not found for email ${email}`);
            return NextResponse.json({ message: 'If the email exists, a verification code has been sent.' }, { status: 200 });
        }

        const tempCode = CryptoJS.lib.WordArray.random(3).toString(CryptoJS.enc.Hex).toUpperCase();

        user.tempPasswordResetCode = tempCode;
        user.tempCodeExpiry = Date.now() + 15 * 60 * 1000;
        await user.save();

        console.log(`Forgot password: Verification code generated for ${email}`);

        try {
            await sendVerificationEmail(user.email, tempCode);
            console.log(`Forgot password: Verification email sent to ${email}`);
        } catch (error) {
            console.error(`Forgot password: Error sending verification email to ${email}:`, error);
            return NextResponse.json({ message: 'Error sending verification email' }, { status: 500 });
        }

        return NextResponse.json({ message: 'If the email exists, a verification code has been sent.' });
    } catch (error) {
        console.error('Forgot password: Unexpected error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}