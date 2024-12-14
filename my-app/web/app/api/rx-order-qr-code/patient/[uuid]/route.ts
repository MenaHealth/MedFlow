// app/api/rx-order-qr-code/patient/[id]/route.ts

import { NextResponse } from 'next/server';
import Patient from '@/models/patient';
import dbConnect from '@/utils/database';
import { IRxOrder, IPatient } from '@/models/patient';

export const GET = async (request: Request, { params }: { params: { uuid: string } }) => {
    try {
        await dbConnect();

        const { uuid } = params;

        // Find the patient with the RX order matching the UUID
        const patient = await Patient.findOne({ "rxOrders.PatientRxUrl": { $regex: uuid } });
        if (!patient) {
            return new NextResponse(
                JSON.stringify({ error: 'RX order not found: patient' }),
                { status: 404 }
            );
        }

        // Find the specific RX order
        const rxOrder = patient.rxOrders.find((order: IRxOrder) => order.PatientRxUrl?.includes(uuid));
        if (!rxOrder) {
            return new NextResponse(
                JSON.stringify({ error: 'RX order not found: order' }),
                { status: 404 }
            );
        }

        // Return detailed RX order information along with patient details
        return new NextResponse(
            JSON.stringify({
                // Patient information
                patientName: `${patient.firstName} ${patient.lastName}`,
                patientDob: patient.dob,
                patientCountry: patient.country,
                patientCity: patient.city,

                // RX order information
                PharmacyQrCode: rxOrder.PharmacyQrCode,
                doctorSpecialty: rxOrder.doctorSpecialty,
                prescribingDr: rxOrder.prescribingDr,
                validTill: rxOrder.validTill,
                prescribedDate: rxOrder.prescribedDate,
                city: rxOrder.city,
                rxStatus: rxOrder.rxStatus,
                prescriptions: rxOrder.prescriptions,
            }),
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
