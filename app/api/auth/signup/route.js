// app/api/auth/signup/route.js

import { NextResponse } from 'next/server';
import User from '@/models/user';
import dbConnect from '@/utils/database';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    await dbConnect();

    const { name, email, password, accountType, securityQuestions } = await request.json();

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: `${accountType} (email) already exists. Please login.` }, { status: 400 });
        }

        const newUser = new User({
            userID: uuidv4(),
            accountType,
            name,
            email,
            password,
            securityQuestions,
        });

        console.log('New user object:', newUser);

        await newUser.save();

        return NextResponse.json({ userId: newUser.userId, message: `${accountType} created successfully` }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}