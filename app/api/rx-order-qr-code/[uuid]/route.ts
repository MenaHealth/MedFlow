// app/api/rx-order-qr-code/[uuid]/route.ts

import { NextResponse } from 'next/server';
import Patient from "@/models/patient";
import dbConnect from '../../../../utils/database';
import { IRxOrder } from '@/models/patient'; // Import the IRxOrder interface

export const GET = async (request: Request, { params }: { params: { uuid: string } }) => {
    try {
        await dbConnect();

        const { uuid } = params;

        const patient = await Patient.findOne({ "rxOrders.rxUrl": { $regex: uuid } });
        if (!patient) {
            return new NextResponse('RX order not found', { status: 404 });
        }

        // Use IRxOrder to type the `order` parameter
        const rxOrder = patient.rxOrders.find((order: IRxOrder) => order.rxUrl?.includes(uuid));
        if (!rxOrder) {
            return new NextResponse('RX order not found', { status: 404 });
        }

        // Return detailed RX order information
        return new NextResponse(
            JSON.stringify({
                qrCode: rxOrder.qrCode,
                doctorSpecialty: rxOrder.doctorSpecialty,
                prescribingDr: rxOrder.prescribingDr,
                validTill: rxOrder.validTill,
                prescriptions: rxOrder.prescriptions,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching RX order:', error);
        return new NextResponse('Failed to fetch RX order', { status: 500 });
    }
};