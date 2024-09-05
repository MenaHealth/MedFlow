// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import dbConnect from '@/utils/database';

export async function POST(request) {
    await dbConnect();

    const { email, password } = await request.json();

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found for email:', email);
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
        }

        console.log('User found:', user);

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Password mismatch. Provided password:', password);
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
        }

        console.log('Password match successful for user:', user.email);
        return NextResponse.json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                name: user.name || user.firstName,
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}