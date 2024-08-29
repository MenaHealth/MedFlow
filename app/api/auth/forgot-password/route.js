// app/api/auth/forgot-password/reset.js

import { NextResponse } from 'next/server';
import User from '@/models/user';
import dbConnect from '@/utils/database';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    await dbConnect();

    const { email, securityQuestion, securityAnswer, newPassword } = await request.json();

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'Email not found' }, { status: 404 });
        }

        // Check if the security question and answer match
        const matched = user.securityQuestions.some((question) => question.question === securityQuestion && bcrypt.compareSync(securityAnswer, question.answer));

        if (!matched) {
            return NextResponse.json({ message: 'Invalid security answer' }, { status: 401 });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error resetting password:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}