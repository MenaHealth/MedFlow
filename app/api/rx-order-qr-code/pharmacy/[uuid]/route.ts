// app/api/rx-order-qr-code/pharmacy/[uuid]/route.ts
// Getting the pharmacy RX order view

import { NextResponse } from 'next/server';
import Patient from '@/models/patient';
import dbConnect from '@/utils/database';
import { IRxOrder } from '@/models/patient';

export const GET = async (request: Request, { params }: { params: { uuid: string } }) => {
    try {
        await dbConnect();

        const { uuid } = params;

        // Find the patient with the RX order matching the PharmacyQrUrl
        const patient = await Patient.findOne({ "rxOrders.PharmacyQrUrl": { $regex: uuid } });
        if (!patient) {
            return new NextResponse(
                JSON.stringify({ error: 'RX order not found: patient' }),
                { status: 404 }
            );
        }

        const rxOrder = patient.rxOrders.find((order: IRxOrder) => order.PharmacyQrUrl?.includes(uuid));
        if (!rxOrder) {
            return new NextResponse(
                JSON.stringify({ error: 'RX order not found: order' }),
                { status: 404 }
            );
        }

        // Include the patientId in the response
        return new NextResponse(
            JSON.stringify({ rxOrder, patientId: patient._id }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error fetching RX order:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch RX order' }),
            { status: 500 }
        );
    }
};