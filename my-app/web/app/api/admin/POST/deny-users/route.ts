// app/api/adminDashboard/POST/denied-users/route.ts

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
        await dbConnect();

        // Check authorization
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, SECRET) as JwtPayload;

        if (typeof decoded === 'object' && decoded?.isAdmin) {
            // Parse the request body to get user IDs
            const { userIds } = await request.json();
            if (!Array.isArray(userIds) || userIds.length === 0) {
                return NextResponse.json({ message: 'Invalid or missing user IDs' }, { status: 400 });
            }

            // Delete users with the specified IDs
            const result = await User.deleteMany({ _id: { $in: userIds } });

            return NextResponse.json({
                message: 'Users deleted successfully',
                deletedCount: result.deletedCount,
            });
        } else {
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }
    } catch (error) {
        console.error('Error deleting denied users:', error);
        return NextResponse.json({ message: 'Failed to delete denied users' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';