// app/api/adminDashboard/GET/med-orders/route.ts

import { NextResponse } from 'next/server';
import dbConnect from './../../../../../utils/database';
import MedOrder from './../../../../../models/medOrder';

export async function GET(request: Request) {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    try {
        const totalOrders = await MedOrder.countDocuments();
        const medOrders = await MedOrder.find()
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            orders: medOrders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('Error fetching med orders:', error);
        return NextResponse.json({ error: 'Failed to fetch med orders' }, { status: 500 });
    }
}