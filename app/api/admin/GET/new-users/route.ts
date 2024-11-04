// app/api/admin/GET/new-users/route.ts

import { NextResponse } from 'next/server';
import dbConnect from './../../../../../utils/database';
import User from "./../../../../../models/user";

export async function GET(request: Request) {
    await dbConnect();

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    try {
        const query = {
            authorized: { $exists: false },
        };

        const totalUsers = await User.countDocuments(query);
        const pendingUsers = await User.find(query)
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
        return NextResponse.json({ error: 'Failed to fetch new users' }, { status: 500 });
    }
}
