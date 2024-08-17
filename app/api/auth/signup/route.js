// app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import dbConnect from '@/utils/database';

// app/api/auth/signup/route.js
export async function POST(request) {
    await dbConnect();

    const { name, email, password, accountType } = await request.json();

    try {
        console.log('Checking if user exists');
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists');
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        console.log('Creating new user');
        const newUser = new User({
            name,
            email,
            password, // Don't hash the password here
            accountType,
        });

        await newUser.save();
        console.log('User created successfully');

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}