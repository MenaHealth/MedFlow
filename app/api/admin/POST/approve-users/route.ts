// app/api/adminDashboard/POST/approve-users/route.ts

import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '@/models/user';
import dbConnect from '@/utils/database';
import { sendApprovalEmail } from '@/utils/emails/user-approval';

const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
}

export async function POST(request: Request) {
    try {
        await dbConnect();

        // Log the authorization header
        const authHeader = request.headers.get('authorization');
        // console.log("Authorization Header:", authHeader);

        if (!authHeader) {
            console.warn("Authorization header is missing");
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        // Log the token
        // console.log("Extracted Token:", token);

        let decoded: JwtPayload | string;
        try {
            decoded = jwt.verify(token, SECRET);
        } catch (error) {
            // console.error("JWT verification failed:", error);
            return NextResponse.json({ message: `JWT verification failed: ${error.message}` }, { status: 403 });
        }

        // Log the decoded token
        // console.log("Decoded Token:", decoded);

        // Check if the user is an admin
        if (typeof decoded === 'object' && decoded?.isAdmin) {
            const { userIds } = await request.json();

            if (!userIds || !Array.isArray(userIds)) {
                console.warn("User IDs are required and must be an array");
                return NextResponse.json({ message: 'User IDs are required' }, { status: 400 });
            }

            // Log the user IDs to be approved
            // console.log("User IDs to be approved:", userIds);

            for (const userId of userIds) {
                const user = await User.findById(userId);

                if (!user) {
                    // console.warn(`User not found with ID: ${userId}`);
                    continue;
                }

                user.authorized = true;
                user.approvalDate = new Date();
                await user.save();

                // Log the email sending attempt
                // console.log(`Sending approval email to: ${user.email}`);
                await sendApprovalEmail(user.email, user.firstName, user.lastName, user.accountType);
            }

            // console.log("User approval process completed successfully");
            return NextResponse.json({ message: 'Users approved successfully' }, { status: 200 });
        } else {
            // console.warn("Admin access required - decoded token does not indicate admin");
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }
    } catch (error) {
        // console.error('Error during user approval:', error);
        if (error instanceof Error) {
            return NextResponse.json({ message: `Authorization failed: ${error.message}` }, { status: 500 });
        }
    }
}