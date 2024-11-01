// app/api/admin/GET/denied-users/route.ts

import { NextResponse } from 'next/server';
import dbConnect from './../../../../../utils/database';
import User from "./../../../../../models/user";

export async function GET(request: Request) {
    console.log("Starting denied users fetch...");
    await dbConnect();
    console.log("Database connection established");

    const { searchParams } = new URL(request.url);
    let page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Ensure page is at least 1 to avoid negative skip values
    page = Math.max(1, page);
    const skip = (page - 1) * limit;

    try {
        const totalUsers = await User.countDocuments({ denialDate: { $exists: true } });
        console.log("Total denied users found:", totalUsers);

        const deniedUsers = await User.find({ authorized: false })
            .select('firstName lastName email accountType countries denialDate')
            .skip(skip)
            .limit(limit);

        console.log("Denied users fetched:", deniedUsers);

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