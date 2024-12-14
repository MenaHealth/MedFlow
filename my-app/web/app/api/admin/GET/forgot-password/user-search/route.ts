// app/api/admin/GET/forgot-password/user-search/route.ts

import { NextResponse } from 'next/server';
import dbConnect from './../../../../../../utils/database';
import User from './../../../../../../models/user';
import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET as string;
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

export async function GET(request: Request) {
    await dbConnect();

    const authHeader = request.headers.get('authorization');
    const decoded = verifyAdminToken(authHeader);
    if (!decoded) {
        return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || '';

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        // Query to find user by email
        const user = await User.findOne({ email: { $regex: email, $options: 'i' } })
            .select('firstName lastName email accountType countries languages doctorSpecialty approvalDate passwordResetCount adminResetPasswordLink adminResetLinkExpiry');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                accountType: user.accountType,
                country: user.countries?.[0] || 'N/A',
                language: user.languages?.[0] || 'N/A',
                doctorSpecialty: user.doctorSpecialty,
                approvalDate: user.approvalDate,
                passwordResetCount: user.passwordResetCount,
                resetLink: user.adminResetPasswordLink,
                resetLinkExpiration: user.adminResetLinkExpiry,
            },
        });
    } catch (error) {
        console.error('Error searching user:', error);
        return NextResponse.json({ error: 'Failed to search user' }, { status: 500 });
    }
}