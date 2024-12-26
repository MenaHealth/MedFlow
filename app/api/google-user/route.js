// app/api/google-user/route.ts
import GoogleUser from '@/models/googleUser';
import dbConnect from '@/utils/database';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
    const { userID, name, email, accountType, image, googleId, googleEmail, googleImage } = await request.json();

    try {
        await dbConnect();

        // Check if Google account is already linked to another user
        const existingGoogleUser = await GoogleUser.findOne({ googleId });
        if (existingGoogleUser) {
            return new Response("Google account already linked to another user", { status: 400 });
        }

        // Find the user by userID
        const user = await GoogleUser.findById(userID);
        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        // Update user with Google information
        user.googleId = googleId;
        user.googleEmail = googleEmail;
        user.googleImage = googleImage;

        await user.save();

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return new Response(`Error linking Google account: ${error}`, { status: 500 });
    }
};