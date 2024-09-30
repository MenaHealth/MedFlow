import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '@/models/user';
import Admin from '@/models/admin'; // Import the Admin model
import dbConnect from '@/utils/database';

const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
}

// POST: Add a user to the admin collection
export async function POST(request: Request) {
    try {
        console.log('API request received. Connecting to database...');
        await dbConnect();

        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return NextResponse.json({ message: 'Token missing' }, { status: 401 });
        }

        const decoded = jwt.verify(token, SECRET) as string | JwtPayload;

        if (typeof decoded !== 'object' || !decoded?.isAdmin) {
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: `User not found: ${userId}` }, { status: 404 });
        }

        // Check if the user is already an admin
        const existingAdmin = await Admin.findOne({ userId: user._id });
        if (existingAdmin) {
            return NextResponse.json({ message: 'User is already an admin' }, { status: 400 });
        }

        // Add user to the admin collection
        const newAdmin = new Admin({
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
        await newAdmin.save();

        return NextResponse.json({ message: 'User added as admin successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error adding user as admin:', error);
        return NextResponse.json({ message: `Failed to add user as admin: ${error.message}` }, { status: 500 });
    }
}

// GET: Fetch all admins
export async function GET() {
    try {
        console.log('Fetching admins...');
        await dbConnect();

        const admins = await Admin.find().populate('userId', 'firstName lastName email');
        return NextResponse.json({ admins }, { status: 200 });
    } catch (error) {
        console.error('Error fetching admins:', error);
        return NextResponse.json({ message: `Failed to fetch admins: ${error.message}` }, { status: 500 });
    }
}

// DELETE: Remove a user from the admin collection
export async function DELETE(request: Request) {
    try {
        console.log('API request received. Connecting to database...');
        await dbConnect();

        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return NextResponse.json({ message: 'Token missing' }, { status: 401 });
        }

        const decoded = jwt.verify(token, SECRET) as string | JwtPayload;

        if (typeof decoded !== 'object' || !decoded?.isAdmin) {
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const { adminId } = body;

        if (!adminId) {
            return NextResponse.json({ message: 'Admin ID is required' }, { status: 400 });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return NextResponse.json({ message: `Admin not found: ${adminId}` }, { status: 404 });
        }

        await Admin.deleteOne({ _id: adminId });

        return NextResponse.json({ message: 'Admin removed successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error removing admin:', error);
        return NextResponse.json({ message: `Failed to remove admin: ${error.message}` }, { status: 500 });
    }
}