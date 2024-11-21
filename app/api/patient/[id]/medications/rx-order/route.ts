// app/api/patient/[id]/medications/rx-order-qr-code/route.ts
// Save rx order, patient rx order url, generate a qr code and pharmacy url behind the qr code

import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import Patient from '../../../../../../models/patient';
import dbConnect from '../../../../../../utils/database';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();

        const patientId = params.id;
        const requestData = await request.json();
        const {
            doctorSpecialty,
            prescribingDr,
            drEmail,
            drId,
            validTill,
            city,
            prescriptions,
        } = requestData;

        if (!doctorSpecialty || !prescriptions || prescriptions.length === 0) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

        const uniqueId = uuidv4();
        const rxUrl = `${baseUrl}/rx-order-qr-code/${uniqueId}`;
        const qrUrl = `${baseUrl}/rx-order-qr-code/pharmacy/${uniqueId}`;

        const qrCodeURL = await QRCode.toDataURL(qrUrl);

        const newRxOrder = {
            rxOrderId: uniqueId, // Include this field for querying later
            doctorSpecialty,
            prescribingDr,
            drEmail,
            drId,
            prescribedDate: new Date(),
            validTill: new Date(validTill),
            city,
            prescriptions: prescriptions.map((p: any) => ({
                diagnosis: p.diagnosis,
                medication: p.medication,
                dosage: p.dosage,
                frequency: p.frequency,
            })),
            qrCode: qrCodeURL,
            PatientRxUrl: rxUrl,
            PharmacyQrUrl: qrUrl,
            rxStatus: 'not reviewed',
        };

        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            { $push: { rxOrders: newRxOrder } },
            { new: true, runValidators: true }
        );

        if (!updatedPatient) {
            return new NextResponse('Failed to update patient record', { status: 500 });
        }

        console.log('Updated Patient:', updatedPatient); // Debug log to verify saving

        return new NextResponse(JSON.stringify(updatedPatient), { status: 201 });
    } catch (error) {
        console.error('Error saving RX order:', error);
        return new NextResponse('Failed to save RX order', { status: 500 });
    }
}