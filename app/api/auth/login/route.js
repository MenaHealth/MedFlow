import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import Patient from '@/models/patient'; // Import the Patient model
import dbConnect from '@/utils/database';

export async function POST(request) {
    await dbConnect();

    const { email, password, accountType } = await request.json(); // Ensure accountType is sent

    try {
        let user;

        if (accountType === 'Doctor') {
            user = await User.findOne({ email });
        } else if (accountType === 'Patient') {
            user = await Patient.findOne({ email });
        }

        if (!user) {
            console.log('User not found');
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Invalid password');
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
        }

        console.log('User logged in successfully');
        return NextResponse.json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                name: user.name || user.firstName,
                accountType: accountType
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}