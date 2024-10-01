// app/api/auth/forgot-password/reset-password/route.ts

import User from '@/models/user';
import dbConnect from '@/utils/database';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
    await dbConnect();

    const { email, securityAnswer, newPassword } = await request.json();

    console.log('Request body:', { email, securityAnswer, newPassword });

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found:', email);
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        console.log('User found:', user);

        const securityQuestion = user.securityQuestions.find((question) => {
            console.log('Comparing security answer:', securityAnswer, question.answer);
            return bcrypt.compareSync(securityAnswer, question.answer);
        });

        if (!securityQuestion) {
            console.log('Incorrect security answer');
            return NextResponse.json({ message: 'Incorrect security answer' }, { status: 401 });
        }

        console.log('Security question found:', securityQuestion);

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        console.log('Hashed password:', hashedPassword);

        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        console.log('Password reset successfully');

        return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}