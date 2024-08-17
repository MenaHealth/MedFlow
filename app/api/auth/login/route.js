// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import dbConnect from '@/utils/database';

export async function POST(request) {
    await dbConnect();

    const { email, password } = await request.json();

    try {
        console.log('Checking if user exists');
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return NextResponse.json({ message: 'Invalid email or password3' }, { status: 400 });
        }

        // Add console logs to debug password comparison
        console.log('Password from request:', password);
        console.log('Hashed password from database:', user.password);

        console.log('Verifying password');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password is valid:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Invalid password');
            return NextResponse.json({ message: 'Invalid email or password4' }, { status: 400 });
        }

        console.log('User logged in successfully');
        return NextResponse.json({ message: 'Login successful', user: { id: user._id, email: user.email, name: user.name, accountType: user.accountType } }, { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}