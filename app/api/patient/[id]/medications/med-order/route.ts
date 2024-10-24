// app/api/patient/[id]/medications/med-order/route.ts
import { NextResponse } from 'next/server';
import Patient from '../../../../../../models/patient';
import dbConnect from '../../../../../../utils/database';
import { Types } from 'mongoose';

interface Params {
    params: {
        id: string;
    };
}

export const POST = async (request: Request, { params }: Params) => {
    console.log('Received request for creating med order');

    try {
        const requestData = await request.json();

        const {
            email,
            date,
            authorName,
            authorID,
            content: {
                doctorSpecialty,
                patientName,
                phoneNumber,
                address,
                diagnosis,
                medications,
                dosage,
                frequency
            }
        } = requestData;

        // Ensure the content field is an object and contains all required fields
        if (
            typeof doctorSpecialty !== 'string' ||
            typeof patientName !== 'string' ||
            typeof phoneNumber !== 'string' ||
            typeof address !== 'string' ||
            typeof diagnosis !== 'string' ||
            typeof medications !== 'string' ||
            typeof dosage !== 'string' ||
            typeof frequency !== 'string'
        ) {
            return new NextResponse("Invalid content structure", { status: 400 });
        }

        await dbConnect();
        console.log('Database connected');

        // Validate patient ID
        if (!Types.ObjectId.isValid(params.id)) {
            console.error('Invalid patient ID:', params.id);
            return new NextResponse("Invalid ID", { status: 400 });
        }

        // Create a new med order
        const newMedOrder = {
            email,
            date: date || new Date(), // Default to the current date if not provided
            authorName,
            authorID,
            content: {
                doctorSpecialty,
                patientName,
                phoneNumber,
                address,
                diagnosis,
                medications,
                dosage,
                frequency
            }
        };

        // Update the patient document by adding the new med order to the medOrders array
        const updateResult = await Patient.updateOne(
            { _id: params.id },
            { $push: { medOrders: newMedOrder } }
        );

        if (updateResult.modifiedCount === 0) {
            console.error(`Patient with ID ${params.id} not found or med order not added`);
            return new NextResponse(`Failed to add med order for patient with ID ${params.id}`, { status: 404 });
        }

        console.log('Med order saved successfully');

        // Return the new med order as the response
        return new NextResponse(JSON.stringify(newMedOrder), { status: 201 });
    } catch (error) {
        console.error('Failed to add med order:', error);
        if (error instanceof Error) {
            return new NextResponse(`Failed to add med order: ${error.message}`, { status: 500 });
        } else {
            return new NextResponse('Failed to add med order due to an unknown error', { status: 500 });
        }
    }
};