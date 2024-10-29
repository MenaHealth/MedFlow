// app/api/admin/GET/existing-users/route.ts

import { NextResponse } from 'next/server';
import dbConnect from './../../../../../utils/database';
import User from "./../../../../../models/user";

export async function GET(request: Request) {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    try {
        // Query for users who haven't been approved or denied yet (authorized is not set)
        const query = {
            authorized: { $exists: false },
        };

        const totalUsers = await User.countDocuments(query);
        const pendingUsers = await User.find(query)
            .select('firstName lastName email accountType countries')  // Fetch only required fields
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