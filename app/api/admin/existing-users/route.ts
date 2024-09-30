// app/api/admin/existing-users/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import User from '@/models/user';

export async function GET(request: Request) {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    try {
        // Count the total number of authorized users
        const totalUsers = await User.countDocuments({ authorized: true });

        // Fetch authorized users with pagination
        const existingUsers = await User.find({ authorized: true })
            .select('firstName lastName email accountType countries approvalDate')
            .skip(skip)
            .limit(limit);

        // Return the data with pagination metadata
        return NextResponse.json({
            users: existingUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('Error fetching existing users:', error);
        return NextResponse.json({ error: 'Failed to fetch existing users' }, { status: 500 });
    }
}