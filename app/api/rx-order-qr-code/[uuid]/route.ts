import { NextResponse } from 'next/server';
import Patient, { IRxOrder } from "@/models/patient"; // Import the IRxOrder type
import dbConnect from '../../../../utils/database';

export const GET = async (request: Request, { params }: { params: { uuid: string } }) => {
    try {
        await dbConnect();

        const { uuid } = params;

        // Debug: Log the UUID
        console.log('Received UUID:', uuid);

        // Find the RX order matching the provided UUID
        const patient = await Patient.findOne({ "rxOrders.rxUrl": { $regex: uuid } });
        if (!patient) {
            console.error('Patient not found for UUID:', uuid);
            return new NextResponse('RX order not found', { status: 404 });
        }

        // Explicitly type 'order' as IRxOrder and check if 'rxUrl' exists
        const rxOrder = patient.rxOrders.find((order: IRxOrder) => order.rxUrl?.includes(uuid));
        if (!rxOrder) {
            console.error('RX order not found in patient data for UUID:', uuid);
            return new NextResponse('RX order not found', { status: 404 });
        }

        // Debug: Log the RX order data
        console.log('RX order found:', rxOrder);

        // Return the QR code
        return new NextResponse(JSON.stringify({ qrCode: rxOrder.qrCode }), { status: 200 });
    } catch (error) {
        console.error('Error fetching RX order:', error);
        return new NextResponse('Failed to fetch RX order', { status: 500 });
    }
};