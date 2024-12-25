// components/user-profile/UserProfileViewModel.ts
import User from '@/models/user';
import dbConnect from '@/utils/database';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
    id: string;
}

export const PATCH = async (request: NextRequest, { params }: { params: Params }) => {
    console.log('Request received:', request.body);
    const { googleId, googleEmail, googleImage } = await request.json();

    try {
        await dbConnect();
        const user = await User.findById(params.id);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (googleId) user.googleId = googleId;
        if (googleEmail) user.googleEmail = googleEmail;
        if (googleImage) user.googleImage = googleImage;

        await user.save();

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `Error linking Google account: ${error}` }, { status: 500 });
    }
};