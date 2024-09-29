// app/api/admin/users/route.js
import { NextResponse } from 'next/server';
import User from '@/models/user';
import dbConnect from '@/utils/database';

export async function GET() {
    await dbConnect();

    try {
        const pendingUsers = await User.find({ authorized: false });
        return NextResponse.json(pendingUsers, { status: 200 });
    } catch (error) {
        console.error('Error fetching pending users:', error);
        return NextResponse.json({ message: `Error fetching users: ${error.message}` }, { status: 500 });
    }
}