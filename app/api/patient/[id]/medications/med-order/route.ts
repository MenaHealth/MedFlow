// app/api/med-orders/route.ts

import { NextResponse } from 'next/server';
import MedOrder from '../../../../../../models/medOrder'; // Import the MedOrder model
import dbConnect from '../../../../../../utils/database';
import { Types } from 'mongoose';

export const POST = async (request: Request) => {
    try {
        await dbConnect(); // Ensure DB connection

        const requestData = await request.json();
        console.log('Received med order data:', requestData);

        const {
            doctorSpecialty,
            prescribingDr,
            drEmail,
            drId,
            patientName,
            patientPhone,
            patientCity,
            patientId,
            orderDate,
            validated,
            medications
        } = requestData;

        // Ensure required fields are valid
        if (
            !patientId ||
            typeof doctorSpecialty !== 'string' ||
            typeof prescribingDr !== 'string' ||
            typeof drEmail !== 'string' ||
            typeof drId !== 'string' ||
            typeof patientName !== 'string' ||
            typeof patientPhone !== 'string' ||
            typeof patientCity !== 'string' ||
            !Array.isArray(medications) ||
            medications.some(med => (
                typeof med.diagnosis !== 'string' ||
                typeof med.medication !== 'string' ||
                typeof med.dosage !== 'string' ||
                typeof med.frequency !== 'string' ||
                typeof med.quantity !== 'string'
            ))
        ) {
            return new NextResponse("Invalid med order data", { status: 400 });
        }

        // Validate patient ID
        if (!Types.ObjectId.isValid(patientId)) {
            console.error('Invalid patient ID:', patientId);
            return new NextResponse("Invalid patient ID", { status: 400 });
        }

        // Create the new Med Order document
        const newMedOrder = new MedOrder({
            doctorSpecialization: doctorSpecialty,
            prescribingDr,
            drEmail,
            drId,
            patientName,
            patientPhone,
            patientCity,
            patientId: new Types.ObjectId(patientId),
            orderDate: orderDate || new Date(),
            validated: validated || false, // default to false if not provided
            medications: medications.map(med => ({
                diagnosis: med.diagnosis,
                medication: med.medication,
                dosage: med.dosage,
                frequency: med.frequency,
                quantity: med.quantity
            }))
        });

        // Save the Med Order to the medOrders collection
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