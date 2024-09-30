// app/api/admin/pending-users/route.ts

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
        // Fetch users who are not authorized (pending approval)
        const totalUsers = await User.countDocuments({ authorized: false });
        const pendingUsers = await User.find({ authorized: false })
            .select('firstName lastName email accountType countries')
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            users: pendingUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('Error fetching pending users:', error);
        return NextResponse.json({ error: 'Failed to fetch pending users' }, { status: 500 });
    }
}