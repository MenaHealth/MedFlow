// app/api/user/link-google/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import User from '@/models/user';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { userId, googleId, googleEmail, googleImage } = await req.json();

        // Check if the Google ID is already linked to another user
        const existingGoogleUser = await User.findOne({ googleId });
        if (existingGoogleUser && existingGoogleUser._id.toString() !== userId) {
            return NextResponse.json({ error: 'Google account already linked to another user' }, { status: 400 });
        }

        // Update the user with Google details
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        user.googleId = googleId;
        user.googleEmail = googleEmail;
        user.googleImage = googleImage;
        await user.save();

        return NextResponse.json({ message: 'Google account linked successfully', user });
    } catch (error) {
        console.error('Error linking Google account:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}