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
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return NextResponse.json({ message: 'Token missing' }, { status: 401 });
        }

        const decoded = jwt.verify(token, SECRET) as string | JwtPayload;

        if (typeof decoded === 'object' && decoded?.isAdmin) {
            console.log('Admin authenticated successfully.');
        } else {
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const { userIds } = body;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json({ message: 'User IDs are required' }, { status: 400 });
        }

        for (const userId of userIds) {
            const user = await User.findById(userId);
            if (!user) {
                return NextResponse.json({ message: `User not found: ${userId}` }, { status: 404 });
            }

            user.authorized = false;
            user.denialDate = new Date();  // Set denialDate
            await user.save();
        }

        return NextResponse.json({ message: 'Users denied successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error during user denial:', error);
        return NextResponse.json({ message: 'Error occurred' }, { status: 500 });
    }
}