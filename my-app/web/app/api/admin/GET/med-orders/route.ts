import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from './../../../../../utils/database';
import MedOrder from './../../../../../models/medOrder';

const SECRET = process.env.JWT_SECRET as string;

export async function GET(request: Request) {
    await dbConnect();

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ error: 'Authorization token missing' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        console.log("Decoded Token:", decoded);

        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '20', 10);
        const skip = (page - 1) * limit;

        const totalOrders = await MedOrder.countDocuments();
        const medOrders = await MedOrder.find().skip(skip).limit(limit);

        return NextResponse.json({
            orders: medOrders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error("JWT verification error:", error);
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }
}
