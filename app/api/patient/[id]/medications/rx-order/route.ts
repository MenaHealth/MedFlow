// app/api/patient/[id]/medications/rx-order/route.ts

import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import Patient from '../../../../../../models/patient';
import dbConnect from '../../../../../../utils/database';

export const POST = async (request: Request, { params }: { params: { id: string } }) => {
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
            validated,
            prescriptions
        } = requestData;

        // Validate required fields
        if (!doctorSpecialty || !prescriptions || prescriptions.length === 0) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const baseUrl =
            process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_API_URL
                : process.env.NEXTAUTH_URL || "http://localhost:3000";

        const uniqueId = uuidv4();
        const rxUrl = `${baseUrl}/rx-order/patient/${uniqueId}`; // Construct the custom URL

        const newRxOrder = {
            doctorSpecialty,
            prescribingDr,
            drEmail,
            drId,
            prescribedDate: new Date(),
            validTill: new Date(validTill),
            city,
            validated,
            prescriptions: prescriptions.map((p: any) => ({
                diagnosis: p.diagnosis,
                medication: p.medication,
                dosage: p.dosage,
                frequency: p.frequency,
            })),
            rxUrl, // Save the custom URL
        };

        // Save the new RX order
        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            { $push: { rxOrders: newRxOrder } },
            { new: true, runValidators: true }
        );

        if (!updatedPatient) {
            return new NextResponse('Failed to update patient record', { status: 500 });
        }

        // Find the recently added RX order
        const addedRxOrder = updatedPatient.rxOrders[updatedPatient.rxOrders.length - 1];

        // Generate QR code based on the saved rxUrl
        const qrCodeURL = await QRCode.toDataURL(rxUrl);

        // Update the RX order with the QR code
        addedRxOrder.qrCode = qrCodeURL;
        await updatedPatient.save();

        return new NextResponse(JSON.stringify(updatedPatient), { status: 201 });
    } catch (error) {
        console.error('Failed to add RX order:', error);
        return new NextResponse('Failed to add RX order', { status: 500 });
    }
};