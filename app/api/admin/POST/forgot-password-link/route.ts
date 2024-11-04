// app/api/admin/POST/forgot-password-link/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from './../../../../../utils/database';
import User from './../../../../../models/user';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';

const SECRET = process.env.JWT_SECRET as string;
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

if (!SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
}

function verifyAdminToken(authHeader: string | null): JwtPayload | null {
    if (!authHeader) {
        console.error('Authorization header missing');
        return null;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET) as JwtPayload;
        if (decoded?.isAdmin) {
            return decoded;
        } else {
            console.error('Admin access required');
            return null;
        }
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}

export async function POST(request: Request) {
    await dbConnect();

    const authHeader = request.headers.get('authorization');
    const decoded = verifyAdminToken(authHeader);
    if (!decoded) {
        return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
    }

    const { userId } = await request.json();

    try {
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Generate unique reset code
        const resetCode = uuidv4();
        const resetLink = `${BASE_URL}/reset-password?code=${resetCode}`;
        const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

        // Update user with the reset link and expiration
        user.adminResetPasswordLink = resetLink;
        user.adminResetLinkExpiry = expiration;
        user.passwordResetCount = (user.passwordResetCount || 0) + 1;
        await user.save();

        console.log('Generated reset link:', resetLink);
        console.log('Reset link expiration:', expiration);

        return NextResponse.json({
            resetLink,
            resetLinkExpiration: expiration,
        });
    } catch (error) {
        console.error('Error generating password reset link:', error);
        return NextResponse.json({ error: 'Failed to generate reset link' }, { status: 500 });
    }
}