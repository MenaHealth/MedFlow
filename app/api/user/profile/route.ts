// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import User from '@/models/user';
import dbConnect from '@/utils/database';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findById(token.id).select('-password -securityQuestions');

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}