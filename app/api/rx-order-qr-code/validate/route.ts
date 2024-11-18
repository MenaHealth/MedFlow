// app/api/rx-order-qr-code/validate/route.ts

import { NextResponse } from 'next/server';
import Patient from "@/models/patient";
import dbConnect from '../../../../utils/database';
import { IRxOrder } from '@/models/patient'; // Import the IRxOrder interface

export const POST = async (request: Request) => {
    try {
        await dbConnect();

        const { uuid } = await request.json(); // Get UUID from request body

        // Find the RX order matching the provided UUID
        const patient = await Patient.findOne({ "rxOrders.rxUrl": { $regex: uuid } });
        if (!patient) {
            return new NextResponse('RX order not found', { status: 404 });
        }

        // Use IRxOrder to type the `order` parameter
        const rxOrder = patient.rxOrders.find((order: IRxOrder) => order.rxUrl?.includes(uuid));
        if (!rxOrder) {
            return new NextResponse('RX order not found', { status: 404 });
        }

        // Check if the RX order is already invalidated
        if (rxOrder.validated === false) {
            return new NextResponse('This RX order has already been invalidated', { status: 400 });
        }

        // Invalidate the RX order
        rxOrder.validated = false;
        await patient.save();

        return new NextResponse('RX order successfully invalidated', { status: 200 });
    } catch (error) {
        console.error('Error validating RX order:', error);
        return new NextResponse('Failed to validate RX order', { status: 500 });
    }
};