// app/api/signup/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import dbConnect from '@/utils/database';

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

    console.log('Received Signup Data:', { email, password, accountType });  // Log incoming request data
    console.log('Password (before hashing):', password);  // Log the password before hashing

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);  // Log hashed password

        // Hash each security question answer
        const hashedSecurityQuestions = await Promise.all(
            securityQuestions.map(async (question) => {
                const hashedAnswer = await bcrypt.hash(question.answer, 10);
                return { question: question.question, answer: hashedAnswer };
            })
        );

        // Create new user object
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

        return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}