// app/api/auth/forgot-password/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import dbConnect from '@/utils/database';
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    console.log('Reset Password API Route Hit');
    await dbConnect();

    try {
        // Get the token from the Authorization header
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error('Authorization token missing or invalid format');
            return NextResponse.json({ message: 'Authorization token is required' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        let decoded;

        // Verify the token using the JWT secret
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload; // Specify JwtPayload here
        } catch (error) {
            console.error('Invalid or expired token');
            return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
        }

        // Parse the request body
        const body = await request.json();
        console.log('Request body:', body);

        const { email, newPassword } = body;
        console.log('Parsed data:', { email, newPassword: newPassword ? '[REDACTED]' : undefined });

        // Check if email in the token matches email in the request body
        if (email !== decoded.email) {
            console.error('Token email does not match request email');
            return NextResponse.json({ message: 'Unauthorized request' }, { status: 403 });
        }

        if (!email || !newPassword) {
            console.error('Email or newPassword missing');
            return NextResponse.json({ message: 'Email and new password are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.error('User not found');
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        console.log('User found, hashing new password');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        console.log('Password reset successfully for user:', email);
        return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Detailed error in reset password route:', errorMessage);
        return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 });
    }
}