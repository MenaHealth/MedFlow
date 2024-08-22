// app/api/auth/signup/patient/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import Patient from '@/models/patient';
import dbConnect from '@/utils/database';

export async function POST(request) {
    await dbConnect();

    const { firstName, email, password } = await request.json();

    try {
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return NextResponse.json({ message: 'Patient already exists' }, { status: 400 });
        }

        const newPatient = new Patient({
            firstName,
            email,
            password: await bcrypt.hash(password, 10),
        });

        await newPatient.save();

        return NextResponse.json({ message: 'Patient created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}