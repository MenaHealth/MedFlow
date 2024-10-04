// app/api/auth/forgot-password/send-verification-code/route.js

import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/utils/emails/forgot-password';
import User from '@/models/user';
import CryptoJS from 'crypto-js';

export async function POST(request: Request) {
    const { email } = await request.json();

    if (!email) {
        return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Generate a 6-digit code using random values
    const tempCode = CryptoJS.lib.WordArray.random(3).toString(CryptoJS.enc.Hex).toUpperCase();

    // Store the code with an expiry timestamp (15 minutes)
    user.tempPasswordResetCode = tempCode;
    user.tempCodeExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now
    await user.save();

    // Send email with the code
    await sendVerificationEmail(user.email, tempCode);

    return NextResponse.json({ message: 'Verification code sent.' });
}