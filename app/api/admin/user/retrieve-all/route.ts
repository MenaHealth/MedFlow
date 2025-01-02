// app/api/admin/user/retrieve-all/route.ts

import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user';
import dbConnect from "@/utils/database";
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.isAdmin) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    try {
        await dbConnect();
        const users = await User.find({}).select('-password').lean();
        return NextResponse.json(users, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: `Error retrieving users: ${error.message}` }, { status: 500 });
    }
}