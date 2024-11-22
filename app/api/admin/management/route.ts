// app/api/admin/management/route.ts

import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Admin from './../../../../models/admin';
import dbConnect from './../../../../utils/database';
import User from './../../../../models/user';
import { sendApprovalEmail } from '@/utils/emails/user-approval';

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

// POST: Add a user to the admin collection
export async function POST(request: Request) {
    try {
        await dbConnect();

        const authHeader = request.headers.get('authorization');
        const decoded = verifyAdminToken(authHeader);
        if (!decoded) {
            return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
        }

        const { userId } = await request.json();
        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const existingAdmin = await Admin.findOne({ userId: user._id });
        if (existingAdmin) {
            return NextResponse.json({ message: 'User is already an admin' }, { status: 400 });
        }

        const newAdmin = new Admin({
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
        await newAdmin.save();

        return NextResponse.json({ message: 'User added as admin successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error in POST request:', error);
        return NextResponse.json({ message: 'Failed to add user as admin' }, { status: 500 });
    }
}

// GET: Fetch all admins
export async function GET(request: Request) {
    try {
        await dbConnect();

        const authHeader = request.headers.get('authorization');
        const decoded = verifyAdminToken(authHeader);
        if (!decoded) {
            return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
        }

        const admins = await Admin.find().populate('userId', 'firstName lastName email');
        if (!admins || admins.length === 0) {
            return NextResponse.json({ message: 'No admins found' }, { status: 404 });
        }

        return NextResponse.json({ admins }, { status: 200 });
    } catch (error: unknown) {
        console.error('Detailed error in GET request:', error);
            if (error instanceof Error) {
                return NextResponse.json({message: 'Failed to fetch admins', error: error.message}, {status: 500});
            }
    }
}

// DELETE: Remove a user from the admin collection
export async function DELETE(request: Request) {
    try {
        await dbConnect();

        const authHeader = request.headers.get('authorization');
        const decoded = verifyAdminToken(authHeader);
        if (!decoded) {
            return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
        }

        const { adminId } = await request.json();
        if (!adminId) {
            return NextResponse.json({ message: 'Admin ID is required' }, { status: 400 });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
        }

        await Admin.deleteOne({ _id: adminId });

        return NextResponse.json({ message: 'Admin removed successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error in DELETE request:', error);
        return NextResponse.json({ message: 'Failed to remove admin' }, { status: 500 });
    }
}