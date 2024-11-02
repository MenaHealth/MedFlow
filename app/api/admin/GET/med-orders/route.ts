// app/api/admin/GET/med-orders/route.ts

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
        console.log(`Fetching med orders for page: ${page}, limit: ${limit}, skip: ${skip}`);

        const totalOrders = await MedOrder.countDocuments();
        console.log(`Total Med Orders: ${totalOrders}`);

        const medOrders = await MedOrder.find()
            .skip(skip)
            .limit(limit);

        // console.log(`Fetched Med Orders:`, medOrders);

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