// app/api/rx-order-qr-code-qr-code/[truncatedId]-[uuid]/route.ts
import { NextResponse } from 'next/server';
import Patient from '@/models/patient';
import dbConnect from '@/utils/database';

export const GET = async (request: Request, { params }: { params: { 'truncatedId-uuid': string } }) => {
    try {
        await dbConnect();

        const { 'truncatedId-uuid': idAndUuid } = params;
        const [truncatedId, uuid] = idAndUuid.split('-');

        if (!truncatedId || !uuid) {
            return new NextResponse('Invalid or missing parameters', { status: 400 });
        }

        // Find the patient with the truncated ID
        const patients = await Patient.find({ _id: { $regex: `^${truncatedId}` } });

        if (!patients || patients.length === 0) {
            return new NextResponse('Patient not found', { status: 404 });
        }

        // Search for the RX order matching the UUID
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
        return new NextResponse('Failed to fetch RX order', { status: 500 });
    }
};