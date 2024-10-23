// app/api/med-orders/route.ts

import { NextResponse } from 'next/server';
import MedOrders from '../../../../models/medOrders'; // Import the MedOrders model
import dbConnect from '../../../../utils/database';
import { Types } from 'mongoose';

export const POST = async (request: Request) => {
    try {
        await dbConnect(); // Ensure DB connection

        const requestData = await request.json();
        console.log('Received med order data:', requestData);

        const {
            email,
            date,
            authorName,
            authorID,
            content: {
                doctorSpecialty,
                patientName,
                city,
                medications,
                dosage,
                frequency
            },
            patientId
        } = requestData;

        // Ensure content fields are valid
        if (
            !patientId ||
            typeof patientName !== 'string' ||
            typeof city !== 'string' ||
            typeof medications !== 'string' ||
            typeof dosage !== 'string' ||
            typeof frequency !== 'string' ||
            typeof doctorSpecialty !== 'string'
        ) {
            return new NextResponse("Invalid med order data", { status: 400 });
        }

        // Validate patient ID
        if (!Types.ObjectId.isValid(patientId)) {
            console.error('Invalid patient ID:', patientId);
            return new NextResponse("Invalid patient ID", { status: 400 });
        }

        // Create the new Med Order
        const newMedOrder = new MedOrders({
            patientId: new Types.ObjectId(patientId), // Reference to the patient
            email,
            date: date || new Date(),
            authorName,
            authorID,
            content: {
                doctorSpecialty,
                patientName,
                city,
                medications,
                dosage,
                frequency,
            }
        });

        // Save the Med Order to the MedOrders collection
        const savedMedOrder = await newMedOrder.save();
        console.log('Med order saved successfully:', savedMedOrder);

        // Return the newly created Med Order
        return new NextResponse(JSON.stringify(savedMedOrder), { status: 201 });
    } catch (error) {
        console.error('Failed to add med order:', error);
        if (error instanceof Error) {
            return new NextResponse(`Failed to add med order: ${error.message}`, { status: 500 });
        } else {
            return new NextResponse('An unknown error occurred', { status: 500 });
        }
    }
};