// app/api/auth/signup/approve/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/user';
import dbConnect from '@/utils/database';
import { sendApprovalEmail } from '@/utils/emails/user-approval';  // Make sure to import from the correct path

const SECRET = process.env.JWT_SECRET;

export async function POST(request) {
    await dbConnect();

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
        console.error('Authorization header missing');
        return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.error('Token missing');
        return NextResponse.json({ message: 'Token missing' }, { status: 401 });
    }

    try {
        console.log('Verifying JWT token...');
        // Verify token and ensure admin access
        const decoded = jwt.verify(token, SECRET);
        if (!decoded.isAdmin) {
            console.error('Unauthorized: Admin access required');
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }

        console.log('Admin authenticated successfully. Fetching user data...');
        // Get user data from request body
        const { userId } = await request.json();
        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found:', userId);
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        console.log(`Approving user with ID: ${userId}`);
        // Approve the user
        user.authorized = true;
        await user.save();

        // Send approval email
        console.log(`Sending approval email to user: ${user.email}`);
        await sendApprovalEmail(user.email, user.firstName, user.lastName, user.accountType);

        console.log('User approved and email sent successfully.');
        return NextResponse.json({ message: 'User approved successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error during user approval:', error);
        return NextResponse.json({ message: `Authorization failed: ${error.message}` }, { status: 401 });
    }
}