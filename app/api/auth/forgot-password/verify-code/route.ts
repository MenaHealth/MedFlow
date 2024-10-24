// app/api/auth/forgot-password/verify-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user';
import dbConnect from '@/utils/database';

export async function POST(request: NextRequest): Promise<NextResponse> {
    await dbConnect();

    const { email, tempCode } = await request.json();


    if (!email || !tempCode) {
        console.error('Missing email or verification code in request');
        return NextResponse.json({ success: false, error: 'Email and verification code are required' }, { status: 400 });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.error(`User with email ${email} not found`);
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // Check if the code has expired
        if (Date.now() > user.tempCodeExpiry) {
            console.warn(`Verification code has expired for user with email ${email}`);
            return NextResponse.json({ success: false, error: 'Verification code has expired' }, { status: 401 });
        }

        // Check if the code matches
        if (user.tempPasswordResetCode !== tempCode) {
            console.warn(`Invalid verification code provided for user with email ${email}`);
            return NextResponse.json({ success: false, error: 'Invalid verification code' }, { status: 401 });
        }

        // If verification succeeds, clear the temp code and expiry
        user.tempPasswordResetCode = undefined;
        user.tempCodeExpiry = undefined;
        await user.save();

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error verifying verification code:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}