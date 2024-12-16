// app/api/adminDashboard/POST/approve-users/route.ts

import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '@/models/user';
`import dbConnect from '@/utils/database';`
import { sendApprovalEmail } from '@/utils/emails/user-approval';
import dbConnect from "@/utils/database";

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

        let decoded: JwtPayload | string;
        try {
            decoded = jwt.verify(token, SECRET);
        } catch (error) {
            if (error instanceof Error) {
                return NextResponse.json({ message: `JWT verification failed: ${error.message}` }, { status: 403 });
            }
            return NextResponse.json({ message: 'JWT verification failed' }, { status: 403 });
        }

        if (typeof decoded === 'object' && decoded?.isAdmin) {
            const { userIds } = await request.json();

            if (!userIds || !Array.isArray(userIds)) {
                return NextResponse.json({ message: 'User IDs are required' }, { status: 400 });
            }

            for (const userId of userIds) {
                const user = await User.findById(userId);

                if (!user) {
                    continue;
                }

                user.authorized = true;
                user.approvalDate = new Date();
                await user.save();

                await sendApprovalEmail(user.email, user.firstName, user.lastName, user.accountType);
            }

            return NextResponse.json({ message: 'Users approved successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: `Authorization failed: ${error.message}` }, { status: 500 });
        }
        return NextResponse.json({ message: 'Unknown error occurred during authorization' }, { status: 500 });
    }
}