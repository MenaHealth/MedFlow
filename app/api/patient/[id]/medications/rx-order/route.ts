// app/api/patient/[id]/medications/rx-order/route.ts

import { NextResponse } from 'next/server';
import Patient from '../../../../../../models/patient';
import dbConnect from '../../../../../../utils/database';

export const POST = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        await dbConnect();

        const patientId = params.id;
        const requestData = await request.json();
        const {
            doctorSpecialization,
            prescribingDr,
            drEmail,
            drId,
            validTill,
            city,
            validated,
            prescriptions
        } = requestData;

        // Validate required fields
        if (!doctorSpecialization || !prescriptions || prescriptions.length === 0) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Map each prescription entry to match the schema
        const formattedPrescriptions = prescriptions.map((p: any) => ({
            diagnosis: p.diagnosis,
            medication: p.medication,
            dosage: p.dosage,
            frequency: p.frequency,
        }));

        // Create a new RX order object
        const newRxOrder = {
            doctorSpecialization,
            prescribingDr,
            drEmail,
            drId,
            prescribedDate: new Date(),
            validTill: new Date(validTill),
            city,
            validated,
            prescriptions: formattedPrescriptions,
        };

        console.log("New RX Order:", newRxOrder);

        // Add the new RX order to the patient's rxOrders array
        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            { $push: { rxOrders: newRxOrder } },
            { new: true, runValidators: true }
        );

        if (!updatedPatient) {
            return new NextResponse('Failed to update patient record', { status: 500 });
        }

        console.log("Updated Patient after adding RX Order:", updatedPatient);
        return new NextResponse(JSON.stringify(updatedPatient), { status: 201 });
    } catch (error) {
        console.error('Failed to add rx order:', error);
        return new NextResponse('Failed to add rx order', { status: 500 });
    }
};