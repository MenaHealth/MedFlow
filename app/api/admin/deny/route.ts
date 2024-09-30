// app/api/admin/deny/route.ts

import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '@/models/user';
import dbConnect from '@/utils/database';

const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
}

export async function POST(request: Request) {
    try {
        console.log('Deny API request received. Connecting to database...');
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

        console.log('Verifying JWT token...');
        const decoded = jwt.verify(token, SECRET) as string | JwtPayload;

        // Ensure that the decoded token is an object and has isAdmin
        if (typeof decoded === 'object' && decoded?.isAdmin) {
            console.log('Admin authenticated successfully. Fetching user data...');
        } else {
            console.error('Unauthorized: Admin access required');
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const { userIds } = body;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            console.error('Invalid or missing user IDs');
            return NextResponse.json({ message: 'User IDs are required' }, { status: 400 });
        }

        for (const userId of userIds) {
            console.log(`Searching for user with ID: ${userId}`);
            const user = await User.findById(userId);
            if (!user) {
                console.error('User not found:', userId);
                return NextResponse.json({ message: `User not found: ${userId}` }, { status: 404 });
            }

            console.log(`Denying user with ID: ${userId}`);
            user.authorized = false;
            user.denied = true;
            user.denialDate = new Date();
            await user.save();

            console.log(`User denied: ${userId}`);
        }

        console.log('Users denied successfully.');
        return NextResponse.json({ message: 'Users denied successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error during user denial:', error);

        // Properly handle error type
        if (error instanceof Error) {
            return NextResponse.json({ message: `Authorization failed: ${error.message}` }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'Authorization failed due to an unknown error' }, { status: 500 });
        }
    }
}