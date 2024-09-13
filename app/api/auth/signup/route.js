// app/api/auth/signup/route.js

import { NextResponse } from 'next/server';
import User from '@/models/user';
import dbConnect from '@/utils/database';
import { v4 as uuidv4 } from 'uuid';

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
        gender
    } = await request.json();

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: `User with this email already exists. Please login.` }, { status: 400 });
        }

        const newUser = new User({
            userID: uuidv4(),
            accountType,
            firstName,
            lastName,
            email,
            password,
            securityQuestions,
            dob: new Date(dob),
        });

        if (accountType === 'Doctor') {
            newUser.doctorSpecialty = doctorSpecialty;
            newUser.languages = languages;
            newUser.countries = countries;
            newUser.gender = gender;
        }

        console.log('New user object:', newUser);

        await newUser.save();

        return NextResponse.json({ userId: newUser.userID, message: `${accountType} created successfully` }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}