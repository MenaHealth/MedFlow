// app/api/admin/POST/re-approve-users/route.ts
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
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, SECRET) as JwtPayload;

        if (typeof decoded === 'object' && decoded?.isAdmin) {
            const { userIds } = await request.json();

            if (!userIds || !Array.isArray(userIds)) {
                return NextResponse.json({ message: 'User IDs are required' }, { status: 400 });
            }

            for (const userId of userIds) {
                const user = await User.findById(userId);
                if (user) {
                    user.authorized = true; // Re-approve the user
                    user.approvalDate = new Date();
                    user.denialDate = undefined; // Clear denial date on re-approval
                    await user.save();
                }
            }
            return NextResponse.json({ message: 'Users re-approved successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }
    } catch (error) {
        console.error('Error during user re-approval:', error);
        if (error instanceof Error) {
            return NextResponse.json({ message: `Authorization failed: ${error.message}` }, { status: 500 });
        }
    }
}