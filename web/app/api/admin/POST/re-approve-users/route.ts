// app/api/admin/POST/re-approve-users/route.ts

import { NextResponse } from 'next/server';
import User from '@/models/user';
import dbConnect from '@/utils/database';

export async function POST(request: Request) {
    try {
        await dbConnect();

        // Retrieve the userIds from the request body
        const { userIds } = await request.json();

        if (!userIds || !Array.isArray(userIds)) {
            return NextResponse.json({ message: 'User IDs are required' }, { status: 400 });
        }

        // Iterate over the user IDs and re-approve each user
        for (const userId of userIds) {
            const user = await User.findById(userId);
            if (user) {
                user.authorized = true; // Re-approve the user
                user.approvalDate = new Date();
                user.denialDate = undefined; // Clear denial date on re-approval
                await user.save();
            }
        }

        // Send a success response
        return NextResponse.json({ message: 'Users re-approved successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error during user re-approval:', error);
        if (error instanceof Error) {
            return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
        }
    }
}