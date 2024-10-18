// app/api/patient/[id]/medications/rx-order/route.ts
// app/api/patient/[id]/medications/rx-order/route.ts

import { NextResponse } from 'next/server';
import Patient from "./../../../../../../models/patient";
import { RXForm } from "./../../../../../../models/RXForm";
import dbConnect from "./../../../../../../utils/database";
import { Types } from "mongoose";

// Define the type for params
interface Params {
    params: {
        id: string;
    };
}

// POST method to add a new RX order
export const POST = async (request: Request, { params }: Params) => {
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

        // Create new RX order (RXForm)
        const newRXOrder = new RXForm({
            email,
            date: date || new Date(),
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

        // Add the RX order to the patient's RXForms array
        patient.RXForms.push(newRXOrder);
        await patient.save();

        // Return the new RX order as the response
        return new Response(JSON.stringify(newRXOrder), { status: 201 });
    } catch (error) {
        console.error('Failed to add RX order:', error);
        if (error instanceof Error) {
            return new Response(`Failed to add RX order: ${error.message}`, { status: 500 });
        } else {
            return new Response('Failed to add RX order due to an unknown error', { status: 500 });
        }
    }
};