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
    console.log('Received request for creating RX order');

    try {
        const requestData = await request.json();
        console.log("Received data:", requestData);

        // Destructure fields from the request body
        const {
            email,
            date,
            authorName,
            authorID,
            content: {
                patientName,
                phoneNumber,
                age,
                address,
                referringDr,
                prescribingDr,
                diagnosis,
                medicationsNeeded,
                pharmacyOrClinic,
                medication,
                dosage,
                frequency,
            }
        } = requestData;

        console.log('Data received in content:', {
            patientName,
            phoneNumber,
            age,
            address,
            referringDr,
            prescribingDr,
            diagnosis,
            medicationsNeeded,
            pharmacyOrClinic,
            medication,
            dosage,
            frequency,
        });

        await dbConnect();
        console.log('Database connected');

        // Validate patient ID
        if (!Types.ObjectId.isValid(params.id)) {
            console.error('Invalid patient ID:', params.id);
            return new NextResponse("Invalid ID", { status: 400 });
        }

        // Find the patient by ID
        const patient = await Patient.findById(params.id);
        if (!patient) {
            console.error(`Patient with ID ${params.id} not found`);
            return new NextResponse(`Patient with ID ${params.id} not found`, { status: 404 });
        }

        // Create new RX order
        const newRXOrder = new RxOrders({
            email,
            date: date || new Date(), // Default to the current date if not provided
            authorName,
            authorID,
            content: {
                patientName,
                phoneNumber,
                age,
                address,
                referringDr,
                prescribingDr,
                diagnosis,
                medicationsNeeded,
                pharmacyOrClinic,
                medication,
                dosage,
                frequency
            }
        });

        // Log the new RX order before saving
        console.log('New RX order to be saved:', newRXOrder);

        // Add the RX order to the patient's RXForms array
        patient.RXForms.push(newRXOrder);
        await patient.save();
        console.log('RX order saved successfully');

        // Return the new RX order as the response
        return new NextResponse(JSON.stringify(newRXOrder), { status: 201 });
    } catch (error) {
        console.error('Failed to add RX order:', error);
        if (error instanceof Error) {
            return new NextResponse(`Failed to add RX order: ${error.message}`, { status: 500 });
        } else {
            return new NextResponse('Failed to add RX order due to an unknown error', { status: 500 });
        }
    }
};