// app/api/auth/signup/deny/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/user';
import dbConnect from '@/utils/database';

const SECRET = process.env.JWT_SECRET;  // Ensure you have a JWT secret in your env

export async function POST(request) {
    await dbConnect();

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
        return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return NextResponse.json({ message: 'Token missing' }, { status: 401 });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, SECRET);

        // Check if the user is an admin
        if (!decoded.isAdmin) {
            return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
        }

        // Proceed with denial logic
        const { userId } = await request.json();
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Optionally, you can delete or modify the user as part of the denial logic
        await User.deleteOne({ _id: userId });

        return NextResponse.json({ message: 'User denied successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `Authorization failed: ${error.message}` }, { status: 401 });
    }
}