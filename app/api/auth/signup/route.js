// app/api/signup/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const hashedSecurityQuestions = await Promise.all(
            securityQuestions.map(async (question) => {
                const hashedAnswer = await bcrypt.hash(question.answer, 10);
                return { question: question.question, answer: hashedAnswer };
            })
        );

        const newUser = new User({
            accountType,
            email,
            password: hashedPassword,
            securityQuestions: hashedSecurityQuestions,
            firstName,
            lastName,
            dob,
            doctorSpecialty,
            languages,
            countries,
            gender,
        });

        // Save the user to the database
        await newUser.save();

        // Send the welcome email after a successful signup
        await sendGraphEmail(email, firstName, lastName, accountType);

        return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}