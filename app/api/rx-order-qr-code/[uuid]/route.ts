// app/api/rx-order-qr-code/[uuid]/route.ts

import { NextResponse } from 'next/server';
import Patient from '@/models/patient';
import dbConnect from '@/utils/database';

export const GET = async (request: Request, { params }: { params: { uuid: string } }) => {
    try {
        await dbConnect();

        const { uuid } = params;

        console.log('Received UUID:', uuid);

        if (!uuid) {
            return new NextResponse('Invalid or missing UUID', { status: 400 });
        }

        // Find the patient with the RX order matching the UUID
        const patient = await Patient.findOne({ 'rxOrders.rxOrderId': uuid });

        console.log('Found patient:', patient ? patient._id : 'No patient found');

        if (!patient) {
            return new NextResponse('Patient with RX order not found', { status: 404 });
        }

        // Retrieve the specific RX order from the matched patient
        const rxOrder = patient.rxOrders.find((order: any) => order.rxOrderId === uuid);

        console.log('Found RX order:', rxOrder ? 'Yes' : 'No');

        if (!rxOrder) {
            return new NextResponse('RX order not found', { status: 404 });
        }

        console.log('Returning RX order');
        return new NextResponse(JSON.stringify(rxOrder), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching RX order:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

