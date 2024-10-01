// app/api/admin/approve/route.ts

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
        console.log('API request received. Connecting to database...');
        await dbConnect();

        // Ensure the request is authenticated with a valid JWT token
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

        // Ensure the decoded token is an object and the user is an admin
        if (typeof decoded === 'object' && decoded?.isAdmin) {
            console.log('Admin authenticated successfully.');
        } else {
            console.error('Unauthorized: Admin access required');
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }

        // Extract userIds from the request body
        const body = await request.json();
        const { userIds } = body;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            console.error('Invalid or missing user IDs');
            return NextResponse.json({ message: 'User IDs are required' }, { status: 400 });
        }

        // Process each user for approval
        for (const userId of userIds) {
            console.log(`Searching for user with ID: ${userId}`);
            const user = await User.findById(userId);
            if (!user) {
                console.error('User not found:', userId);
                return NextResponse.json({ message: `User not found: ${userId}` }, { status: 404 });
            }

            // Approve the user
            console.log(`Approving user with ID: ${userId}`);
            user.authorized = true;  // Set the authorized field to true
            user.approvalDate = new Date();  // Set the approval date to the current date
            await user.save();  // Save the updated user document

            // Send the approval email to the user
            console.log(`Sending approval email to user: ${user.email}`);
            await sendApprovalEmail(user.email, user.firstName, user.lastName, user.accountType);
        }

        console.log('Users approved and emails sent successfully.');
        return NextResponse.json({ message: 'Users approved successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error during user approval:', error);
        const err = error as Error;
        return NextResponse.json({ message: `Authorization failed: ${err.message}` }, { status: 500 });
    }
}