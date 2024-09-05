// app/api/auth/auth/doctor/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import dbConnect from '@/utils/database';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    await dbConnect();

    const { name, email, password } = await request.json();

    try {
        const existingDoctor = await User.findOne({ email });
        if (existingDoctor) {
            return NextResponse.json({ message: 'Doctor already exists' }, { status: 400 });
        }

        const newDoctor = new User({
            userID: uuidv4(),
            accountType: 'Doctor',
            name,
            email,
            password: await bcrypt.hash(password, 10),
        });

        await newDoctor.save();

        return NextResponse.json({ doctorId: newDoctor.doctorId, message: 'Doctor created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}