// app/api/adminDashboard/management/route.ts
import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Admin from './../../../../models/admin'; // Import the Admin model
import dbConnect from './../../../../utils/database';
import User from './../../../../models/user';

// import dbConnect from './../../../../../utils/database';
// import User from "./../../../../../models/user";

const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
}

// POST: Add a user to the adminDashboard collection

export async function POST(request: Request) {
    try {
        console.log('API request received. Connecting to database...');
        await dbConnect(); // Ensure connection to the database

        // Authorization header check
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            console.error('Authorization header missing');
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.error('Token missing');
            return NextResponse.json({ message: 'Token missing' }, { status: 401 });
        }

        const decoded = jwt.verify(token, SECRET) as JwtPayload;

        // Ensure the user making the request is an adminDashboard
        if (typeof decoded !== 'object' || !decoded?.isAdmin) {
            console.error('Admin access required');
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            console.error('User ID is missing in the request body');
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.error(`User not found for ID: ${userId}`);
            return NextResponse.json({ message: `User not found: ${userId}` }, { status: 404 });
        }

        // Check if the user is already an adminDashboard
        const existingAdmin = await Admin.findOne({ userId: user._id });
        if (existingAdmin) {
            console.error('User is already an adminDashboard');
            return NextResponse.json({ message: 'User is already an adminDashboard' }, { status: 400 });
        }

        // Add the user to the adminDashboard collection
        const newAdmin = new Admin({
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });

        await newAdmin.save();
        console.log('User added as adminDashboard successfully');
        return NextResponse.json({ message: 'User added as adminDashboard successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error during adminDashboard addition:', error);

        // Type guard to check if error is an instance of Error
        if (error instanceof Error) {
            return NextResponse.json({ message: `Failed to add user as admin: ${error.message}` }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'Failed to add user as adminDashboard due to an unknown error' }, { status: 500 });
        }
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

        if (error instanceof Error) {
            return NextResponse.json({ message: `Failed to fetch admins: ${error.message}` }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'Failed to fetch admins due to an unknown error' }, { status: 500 });
        }
    }
}

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
        console.error('Error removing adminDashboard:', error);

        if (error instanceof Error) {
            return NextResponse.json({ message: `Failed to remove admin: ${error.message}` }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'Failed to remove adminDashboard due to an unknown error' }, { status: 500 });
        }
    }
}