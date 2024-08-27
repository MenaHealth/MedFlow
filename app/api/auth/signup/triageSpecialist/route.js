import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import dbConnect from '@/utils/database';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    await dbConnect();

    const { name, email, password } = await request.json();

    try {
        const existingTriageSpecialist = await User.findOne({ email });
        if (existingTriageSpecialist) {
            return NextResponse.json({ message: 'Triage Specialist already exists' }, { status: 400 });
        }

        const newTriageSpecialist = new User({
            userID: uuidv4(),
            accountType: 'TriageSpecialist',
            name,
            email,
            password: await bcrypt.hash(password, 10),
        });

        await newTriageSpecialist.save();

        return NextResponse.json({ triageSpecialistId: newTriageSpecialist.triageSpecialistId, message: 'Triage Specialist created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}