// app/api/patient/[id]/medications/medical-order/route.ts

import { NextResponse } from 'next/server';
import Patient from "./../../../../../../models/patient";
import { MedX } from "./../../../../../../models/MedX";
import dbConnect from "./../../../../../../utils/database";
import { Types } from 'mongoose';

// Define the type for params
interface Params {
    params: {
        id: string;
    };
}

// POST method to add a new medical order
export const POST = async (request: Request, { params }: Params) => {
    const {
        email,
        date,
        authorName,
        authorID,
        content: {
            doctorSpecialty,
            patientName,
            patientPhoneNumber,
            patientAddress,
            diagnosis,
            medications,
            dosage,
            frequency
        }
    } = await request.json();

    try {
        await dbConnect();

        // Validate patient ID
        if (!Types.ObjectId.isValid(params.id)) {
            return new Response("Invalid ID", { status: 400 });
        }

        // Find the patient by ID
        const patient = await Patient.findById(params.id);
        if (!patient) {
            return new Response(`Patient with ID ${params.id} not found`, { status: 404 });
        }

        // Create new medical order (MedX)
        const newMedOrder = new MedX({
            email,
            date: date || new Date(),
            authorName,
            authorID,
            content: {
                doctorSpecialty,
                patientName,
                patientPhoneNumber,
                patientAddress,
                diagnosis,
                medications,
                dosage,
                frequency
            }
        });

        // Add the medical order to the patient's medOrders array
        patient.medOrders.push(newMedOrder);
        await patient.save();

        // Return the new medical order as the response
        return new Response(JSON.stringify(newMedOrder), { status: 201 });
    } catch (error) {
        console.error('Failed to add medical order:', error);
        if (error instanceof Error) {
            return new Response(`Failed to add medical order: ${error.message}`, { status: 500 });
        } else {
            return new Response('Failed to add medical order due to an unknown error', { status: 500 });
        }
    }
};