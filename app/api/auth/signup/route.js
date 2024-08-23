// app/api/auth/auth/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import Patient from '@/models/patient';
import User from '@/models/user';
import dbConnect from '@/utils/database';

export async function POST(request) {
    await dbConnect();

    const { name, email, password, accountType } = await request.json();

    try {
        let existingUser, newUser;

        if (accountType === 'Doctor') {
            existingUser = await User.findOne({ email });
            if (existingUser) {
                return NextResponse.json({ message: 'Doctor already exists' }, { status: 400 });
            }

            newUser = new User({
                name,
                email,
                password: await bcrypt.hash(password, 10),
                accountType,
            });
        } else if (accountType === 'Patient') {
            existingUser = await Patient.findOne({ email });
            if (existingUser) {
                return NextResponse.json({ message: 'Patient already exists' }, { status: 400 });
            }

            newUser = new Patient({
                firstName: name,
                email,
                password: await bcrypt.hash(password, 10),
            });
        } else {
            return NextResponse.json({ message: 'Invalid account type' }, { status: 400 });
        }

        await newUser.save();

        // Return the ID of the newly created patient
        return NextResponse.json({ patientId: newUser._id, message: `${accountType} created successfully` }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}