// app/api/auth/auth/doctor/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import dbConnect from '@/utils/database';

export async function POST(request) {
    await dbConnect();

    const { name, email, password } = await request.json();

    try {
        const existingDoctor = await User.findOne({ email });
        if (existingDoctor) {
            return NextResponse.json({ message: 'Doctor already exists' }, { status: 400 });
        }

        const newDoctor = new User({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            accountType: 'Doctor', // Ensure account type is set correctly
            // Additional fields can be added here
        });

        await newDoctor.save();

        return NextResponse.json({ doctorId: newDoctor._id, message: 'Doctor created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}