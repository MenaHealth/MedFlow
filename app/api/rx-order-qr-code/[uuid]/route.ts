// app/api/rx-order-qr-code/[id]/route.ts

import { NextResponse } from 'next/server';
import Patient from "@/models/patient";
import dbConnect from '../../../../utils/database';
import { IRxOrder } from '@/models/patient';

export const GET = async (request: Request, { params }: { params: { uuid: string } }) => {
    try {
        await dbConnect();

        const { uuid } = params;

        // Search for the patient using the RX URL
        const patient = await Patient.findOne({ "rxOrders.PatientRxUrl": { $regex: uuid } });
        if (!patient) {
            return new NextResponse(JSON.stringify({ error: 'Patient with RX order not found' }), { status: 404 });
        }

        // Find the specific RX order using the UUID
        const rxOrder = patient.rxOrders.find((order: IRxOrder) => order.PatientRxUrl?.includes(uuid));
        if (!rxOrder) {
            return new NextResponse(JSON.stringify({ error: 'RX order not found' }), { status: 404 });
        }

        // Return RX order details, including the QR code
        return new NextResponse(
            JSON.stringify({
                PharmacyQrCode: rxOrder.PharmacyQrCode,
                doctorSpecialty: rxOrder.doctorSpecialty,
                prescribingDr: rxOrder.prescribingDr,
                validTill: rxOrder.validTill,
                prescriptions: rxOrder.prescriptions,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching RX order:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch RX order' }), { status: 500 });
    }
};