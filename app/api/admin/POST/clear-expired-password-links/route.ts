// app/api/admin/POST/clear-expired-password-links/route.ts
import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '@/models/user';
import dbConnect from '@/utils/database';

const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
}

export async function POST(request: Request) {
    try {
        await dbConnect();

        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        let decoded: JwtPayload | string;
        try {
            decoded = jwt.verify(token, SECRET);
        } catch (error) {
            if (error instanceof Error) {
                return NextResponse.json({ message: `JWT verification failed: ${error.message}` }, { status: 403 });
            }
            return NextResponse.json({ message: 'JWT verification failed' }, { status: 403 });
        }

        if (typeof decoded === 'object' && decoded?.isAdmin) {
            const result = await User.updateMany(
                { adminResetLinkExpiry: { $lt: new Date() } },
                {
                    $unset: {
                        adminResetPasswordLink: "",
                        adminResetLinkExpiry: ""
                    }
                }
            );

            return NextResponse.json({
                message: 'Expired links cleared',
                modifiedCount: result.modifiedCount
            });
        } else {
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: `Failed to clear expired links: ${error.message}` }, { status: 500 });
        }
        return NextResponse.json({ message: 'Unknown error occurred while clearing expired links' }, { status: 500 });
    }
}


