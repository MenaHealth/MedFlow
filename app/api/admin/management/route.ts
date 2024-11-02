// app/api/admin/management/route.ts
import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Admin from './../../../../models/admin'; // Import the Admin model
import dbConnect from './../../../../utils/database';
import User from './../../../../models/user';

const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
}

// POST: Add a user to the adminDashboard collection
export async function POST(request: Request) {
    console.log('POST request received at /api/admin/management');
    try {
        console.log('Connecting to database...');
        await dbConnect();

        const authHeader = request.headers.get('authorization');
        console.log('Authorization header:', authHeader);

        if (!authHeader) {
            console.error('Authorization header missing');
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token:', token);

        const decoded = jwt.verify(token, SECRET) as JwtPayload;
        console.log('Decoded token:', decoded);

        if (typeof decoded !== 'object' || !decoded?.isAdmin) {
            console.error('Admin access required');
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        console.log('POST request body:', body);

        const { userId } = body;
        if (!userId) {
            console.error('User ID is missing in the request body');
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const user = await User.findById(userId);
        console.log('User found for provided userId:', user);

        const existingAdmin = await Admin.findOne({ userId: user._id });
        if (existingAdmin) {
            console.error('User is already an admin');
            return NextResponse.json({ message: 'User is already an admin' }, { status: 400 });
        }

        const newAdmin = new Admin({
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });

        await newAdmin.save();
        console.log('User successfully added as admin');
        return NextResponse.json({ message: 'User added as admin successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error in POST request:', error);
        return NextResponse.json({ message: 'Failed to add user as admin' }, { status: 500 });
    }
}

// GET: Fetch all admins
export async function GET() {
    console.log('GET request received at /api/admin/management');
    try {
        // Step 1: Connect to the database
        await dbConnect();
        console.log('Database connected successfully');

        // Step 2: Fetch all admins, populating user fields
        const admins = await Admin.find().populate('userId', 'firstName lastName email');
        console.log('Raw Admin Data:', admins);

        if (!admins || admins.length === 0) {
            console.warn('No admins found in the database');
            return NextResponse.json({ message: 'No admins found' }, { status: 404 });
        }

        // Check each admin document for structure and populated fields
        admins.forEach((admin, index) => {
            console.log(`Admin ${index + 1}:`, admin);
            console.log(`Admin ${index + 1} userId populated fields:`, admin.userId);
        });

        // Step 3: Return the admins
        console.log('Returning admins data');
        return NextResponse.json({ admins }, { status: 200 });

    } catch (error) {
        console.error('Error in GET request:', error);
        return NextResponse.json({ message: 'Failed to fetch admins' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    console.log('DELETE request received at /api/admin/management');
    try {
        await dbConnect();
        console.log('Database connected successfully');

        const authHeader = request.headers.get('authorization');
        console.log('Authorization header:', authHeader);

        if (!authHeader) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token:', token);

        const decoded = jwt.verify(token, SECRET) as JwtPayload;
        console.log('Decoded token:', decoded);

        if (typeof decoded !== 'object' || !decoded?.isAdmin) {
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        console.log('DELETE request body:', body);

        const { adminId } = body;
        if (!adminId) {
            return NextResponse.json({ message: 'Admin ID is required' }, { status: 400 });
        }

        const admin = await Admin.findById(adminId);
        console.log('Admin found for provided adminId:', admin);

        await Admin.deleteOne({ _id: adminId });
        console.log('Admin removed successfully');

        return NextResponse.json({ message: 'Admin removed successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error in DELETE request:', error);
        return NextResponse.json({ message: 'Failed to remove admin' }, { status: 500 });
    }
}