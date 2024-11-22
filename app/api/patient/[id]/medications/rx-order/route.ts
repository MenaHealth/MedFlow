// app/api/patient/[id]/medications/rx-order/route.ts
// saving a rx order URL for the patient and a QR code for the pharmacist

import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import sharp from 'sharp';
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
            prescriptions,
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
        const patientRxUrl = `${baseUrl}/rx-order/patient/${uniqueId}`; // Patient URL
        const pharmacyQrUrl = `${baseUrl}/rx-order/pharmacy/${uniqueId}`; // Pharmacist URL

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
            PatientRxUrl: patientRxUrl,
            PharmacyQrUrl: pharmacyQrUrl, // Save the pharmacist URL
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

        // Generate QR code as a data URL
        const qrCodeDataURL = await QRCode.toDataURL(pharmacyQrUrl, { errorCorrectionLevel: 'L' });

        // Extract the base64 part from the data URL
        const base64Data = qrCodeDataURL.split(',')[1];

        // Convert base64 to a buffer
        const qrCodeBuffer = Buffer.from(base64Data, 'base64');

        // Compress the QR code using sharp
        const compressedQrCodeBuffer = await sharp(qrCodeBuffer)
            .png({ quality: 70 }) // Compress PNG with quality setting
            .resize(256, 256) // Resize to 256x256
            .toBuffer();

        // Convert buffer to base64 for storage
        const compressedQrCodeBase64 = `data:image/png;base64,${compressedQrCodeBuffer.toString('base64')}`;

        // Update the RX order with the QR code
        addedRxOrder.PharmacyQrCode = compressedQrCodeBase64; // Save compressed QR code
        await updatedPatient.save();

        return new NextResponse(JSON.stringify(updatedPatient), { status: 201 });
    } catch (error) {
        console.error('Failed to add RX order:', error);
        return new NextResponse('Failed to add RX order', { status: 500 });
    }
};