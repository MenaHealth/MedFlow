// app/api/patient/[id]/medications/rx-order/route.ts


import { NextResponse } from 'next/server';
import Patient from '../../../../../../models/patient';
import RxOrders from '../../../../../../models/rxOrders';
import dbConnect from '../../../../../../utils/database';
import { Types } from 'mongoose';

interface Params {
    params: {
        id: string;
    };
}

export const POST = async (request: Request, { params }: Params) => {
    try {
        await dbConnect();

        const requestData = await request.json();
        console.log('Received request data:', requestData);

        // First, find the patient without validation
        const patient = await Patient.findById(params.id);
        if (!patient) {
            return new NextResponse(`Patient with ID ${params.id} not found`, { status: 404 });
        }

        // Create the new RX order document
        const newRXOrder = {
            email: requestData.email,
            date: requestData.date || new Date(),
            authorName: requestData.authorName,
            authorID: requestData.authorID,
            content: {
                patientName: requestData.content.patientName,
                phoneNumber: requestData.content.phoneNumber,
                age: requestData.content.age,
                diagnosis: requestData.content.diagnosis,
                pharmacyOrClinic: requestData.content.pharmacyOrClinic,
                doctorSpecialty: requestData.content.doctorSpecialty,
                prescriptions: requestData.content.prescriptions
            }
        };

        // Use findOneAndUpdate with $push to add the new order
        const updatedPatient = await Patient.findOneAndUpdate(
            { _id: params.id },
            {
                $push: { rxOrders: newRXOrder },
                $set: { updatedAt: new Date() }
            },
            {
                new: true,
                runValidators: false // Disable validation for existing documents
            }
        );

        if (!updatedPatient) {
            throw new Error('Failed to update patient with new RX order');
        }

        return new NextResponse(JSON.stringify(newRXOrder), { status: 201 });
    } catch (error) {
        console.error('Failed to add RX order:', error);
        return new NextResponse(`Failed to add RX order: ${error.message}`, { status: 500 });
    }
};
