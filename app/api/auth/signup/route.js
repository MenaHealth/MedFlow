// app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import Patient from '@/models/patient'; // Patient model
import User from '@/models/user'; // User model
import dbConnect from '@/utils/database';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for patientId generation

export async function POST(request) {
    await dbConnect();

    const { name, email, password, accountType } = await request.json();

    try {
        let existingUser, newUser;

        if (accountType === 'Doctor') {
            console.log('Checking if doctor exists');
            existingUser = await User.findOne({ email });
            if (existingUser) {
                return NextResponse.json({ message: 'Doctor already exists' }, { status: 400 });
            }

            console.log('Creating new doctor');
            newUser = new User({
                name,
                email,
                password: await bcrypt.hash(password, 10),
                accountType,
            });
        } else if (accountType === 'Patient') {
            console.log('Checking if patient exists');
            existingUser = await Patient.findOne({ email });
            if (existingUser) {
                return NextResponse.json({ message: 'Patient already exists' }, { status: 400 });
            }

            console.log('Creating new patient');
            const patientId = uuidv4(); // Generate a unique patientId
            newUser = new Patient({
                firstName: name,
                email,
                password: await bcrypt.hash(password, 10),
                patientId, // Add the generated patientId to the patient document
            });
        } else {
            return NextResponse.json({ message: 'Invalid account type' }, { status: 400 });
        }

        await newUser.save();
        console.log(`${accountType} created successfully`);

        return NextResponse.json({ patientId: newUser.patientId, message: `${accountType} created successfully` }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}