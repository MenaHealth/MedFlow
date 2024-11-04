// app/api/auth/forgot-password/admin-pw-reset/route.ts

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import dbConnect from '@/utils/database';

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { code, newPassword } = await request.json();

        console.log('Received reset request:', { code, newPasswordLength: newPassword?.length });

        if (!code || !newPassword) {
            return NextResponse.json({ message: 'Reset code and new password are required' }, { status: 400 });
        }

        const resetLink = `${BASE_URL}/reset-password?code=${code}`;
        console.log('Searching for reset link:', resetLink);

        // Find the user with the reset link and ensure the link has not expired
        const user = await User.findOne({
            adminResetPasswordLink: resetLink,
            adminResetLinkExpiry: { $gt: new Date() },
        });

        console.log('User found:', !!user);
        if (user) {
            console.log('User email:', user.email);
            console.log('Stored reset link:', user.adminResetPasswordLink);
            console.log('Reset link expiry:', user.adminResetLinkExpiry);
        }

        if (!user) {
            return NextResponse.json({ message: 'Invalid or expired reset link' }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Clear the reset link and expiration
        user.adminResetPasswordLink = undefined;
        user.adminResetLinkExpiry = undefined;
        await user.save();

        console.log('Password reset successfully for user:', user.email);

        return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
    } catch (error) {
        console.error('Password reset error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 });
    }
}