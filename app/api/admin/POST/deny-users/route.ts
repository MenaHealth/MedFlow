// app/api/adminDashboard/GET/denied-users/route.ts

import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '@/models/user';
import dbConnect from '@/utils/database';

const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
}

export async function GET(request: Request) {
    try {
        await dbConnect();
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, SECRET) as JwtPayload;

        if (typeof decoded === 'object' && decoded?.isAdmin) {
            // Find all users who are unauthorized and have a denial date
            const deniedUsers = await User.find({
                authorized: false,
                denialDate: { $exists: true, $ne: null },
            });

            return NextResponse.json(deniedUsers);
        } else {
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }
    } catch (error) {
        console.error('Error fetching denied users:', error);
        return NextResponse.json({ message: 'Failed to fetch denied users' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
// have this line ^^ to stop the Dynamic server usage errors when running `npm run build`