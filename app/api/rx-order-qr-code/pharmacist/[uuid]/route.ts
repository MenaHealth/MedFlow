// app/api/rx-order-qr-code/pharmacist/route.ts

import { NextResponse } from 'next/server';
import Patient from '@/models/patient';
import dbConnect from '@/utils/database';
import { IRxOrder } from '@/models/patient';

export const POST = async (request: Request, { params }: { params: { uuid: string } }) => {
    try {
        await dbConnect();

        const { uuid } = params;

        const patient = await Patient.findOne({ 'rxOrders.rxUrl': { $regex: uuid } });
        if (!patient) {
            return new NextResponse('RX order not found', { status: 404 });
        }

        const rxOrder = patient.rxOrders.find((order: IRxOrder) => order.rxUrl?.includes(uuid));
        if (!rxOrder) {
            return new NextResponse('RX order not found', { status: 404 });
        }

        if (rxOrder.validated) {
            return new NextResponse('RX order already fulfilled', { status: 400 });
        }

        // Mark RX order as fulfilled
        rxOrder.validated = true;
        await patient.save();

        return new NextResponse('RX order successfully fulfilled', { status: 200 });
    } catch (error) {
        console.error('Error fulfilling RX order:', error);
        return new NextResponse('Failed to fulfill RX order', { status: 500 });
    }
};