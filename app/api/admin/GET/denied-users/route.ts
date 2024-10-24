// app/api/admin/denied-users/route.ts

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
        const totalUsers = await User.countDocuments({ denialDate: { $exists: true } });
        const deniedUsers = await User.find({ authorized: false })
            .select('firstName lastName email accountType countries denialDate')
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            users: deniedUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('Error fetching denied users:', error);
        return NextResponse.json({ error: 'Failed to fetch denied users' }, { status: 500 });
    }
}