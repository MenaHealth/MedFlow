// app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import dbConnect from '@/utils/database';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    await dbConnect();

    const { name, email, password, accountType } = await request.json();

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: `${accountType} already exists` }, { status: 400 });
        }

        const newUser = new User({
            userID: uuidv4(),
            accountType,
            name,
            email,
            password: await bcrypt.hash(password, 10),
        });

        await newUser.save();

        return NextResponse.json({ userId: newUser.userId, message: `${accountType} created successfully` }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}