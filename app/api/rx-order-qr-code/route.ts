// app/api/rx-order-qr-code/route.ts
import Patient from '@/models/patient';
import dbConnect from '../../../utils/database';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const truncatedId = searchParams.get('truncatedId');
        const uuid = searchParams.get('uuid');

        if (!truncatedId || !uuid) {
            return new NextResponse('Invalid or missing parameters', { status: 400 });
        }

        // Find the patient based on the truncatedId
        const patients = await Patient.find({ _id: { $regex: `^${truncatedId}` } });

        if (!patients || patients.length === 0) {
            return new NextResponse('Patient not found', { status: 404 });
        }

        // Search within the matched patients for the RX order with the specific UUID
        const patient = patients.find((p) =>
            p.rxOrders.some((order: any) => order.rxOrderId === uuid)
        );

        if (!patient) {
            return new NextResponse('RX order not found', { status: 404 });
        }

        const rxOrder = patient.rxOrders.find((order: any) => order.rxOrderId === uuid);

        return new NextResponse(JSON.stringify(rxOrder), { status: 200 });
    } catch (error) {
        console.error('Error fetching RX order:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}