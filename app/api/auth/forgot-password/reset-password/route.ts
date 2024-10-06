// app/api/auth/forgot-password/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import dbConnect from '@/utils/database';

export async function POST(request: NextRequest) {
    await dbConnect();

    const { email, newPassword } = await request.json();

    console.log('Reset Password Route Hit');
    console.log('Data received:', { email, newPassword });

    if (!email || !newPassword) {
        console.error('Email or newPassword missing');
        return NextResponse.json({ message: 'Email and new password are required' }, { status: 400 });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.error('User not found');
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Save the new hashed password
        user.password = hashedPassword;
        await user.save();

        console.log('Password reset successfully for user:', email);
        return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error resetting password:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}