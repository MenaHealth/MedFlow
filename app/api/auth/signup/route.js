// app/api/signup/route.js
import { NextResponse } from 'next/server';
import User from '@/models/user';
import dbConnect from '@/utils/database';
import { sendGraphEmail } from '@/utils/email'; // Import your email utility

export async function POST(request) {
    await dbConnect();

    const {
        email,
        password,
        accountType,
        securityQuestions,
        firstName,
        lastName,
        dob,
        doctorSpecialty,
        languages,
        countries,
        gender,
    } = await request.json();

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
        }

        const newUser = new User({
            accountType,
            email,
            password, // DO NOT HASH Password in the API route. PW HASHING HAPPENS IN THE user model.
            securityQuestions, // DO NOT HASH Security questions here
            firstName,
            lastName,
            dob: new Date(dob),
            doctorSpecialty,
            languages,
            countries,
            gender,
        });

        await newUser.save();

        await sendGraphEmail(email, firstName, lastName, accountType);

        return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: `Error during signup: ${error.message}` }, { status: 500 });
    }
}