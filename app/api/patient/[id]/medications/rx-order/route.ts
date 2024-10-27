import { NextResponse } from 'next/server';
import Patient from '../../../../../../models/patient';
import dbConnect from './../../../../../../utils/database';

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
            prescriptions
        } = requestData;

        if (!doctorSpecialization || !prescriptions || !prescriptions.prescriptions || prescriptions.prescriptions.length === 0) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const newRxOrder = {
            doctorSpecialization,
            prescribingDr,
            drId,
            drEmail,
            prescribedDate: new Date(),
            prescriptions: {
                validTill: prescriptions.validTill,
                city: prescriptions.city,
                prescription: prescriptions.prescriptions.map((p: any) => ({
                    diagnosis: p.diagnosis,
                    medication: p.medication,
                    dosage: p.dosage,
                    frequency: p.frequency
                })),
            },
            validated: false
        };
        console.log("New RX Order:", newRxOrder);

        // Update patient's rxOrders array by adding the new Rx order
        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            { $push: { "rxOrders.Orders": newRxOrder } },
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