// app/api/patient/[id]/medications/med-order/route.ts


import { NextResponse } from 'next/server';
import MedOrder from '../../../../../../models/medOrder';
import Patient from '../../../../../../models/patient';
import dbConnect from '../../../../../../utils/database';
import { Types } from 'mongoose';

export const POST = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        await dbConnect();

        const patientId = params.id;
        const requestData = await request.json();

        console.log('Received med order data:', requestData);

        const {
            doctorSpecialization,
            prescribingDr,
            drEmail,
            drId,
            patientName,
            patientPhone,
            patientCity,
            orderDate,
            validated,
            medications
        } = requestData;

        // Check that required fields are present and of correct type
        if (
            !Types.ObjectId.isValid(patientId) ||
            typeof doctorSpecialization !== 'string' ||
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

        // Create the new Med Order document
        const newMedOrder = new MedOrder({
            doctorSpecialization,
            prescribingDr,
            drEmail,
            drId,
            patientName,
            patientPhone,
            patientCity,
            patientId: new Types.ObjectId(patientId),
            orderDate: orderDate || new Date(),
            validated: validated || false,
            medications: medications.map(med => ({
                diagnosis: med.diagnosis,
                medication: med.medication,
                dosage: med.dosage,
                frequency: med.frequency,
                quantity: med.quantity
            }))
        });

        const savedMedOrder = await newMedOrder.save();

        // Embed or reference the MedOrder in the Patient model
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return new NextResponse("Patient not found", { status: 404 });
        }

        // Initialize or add the MedOrder reference
        if (!patient.medOrders) {
            patient.medOrders = [];
        }

        patient.medOrders.push(savedMedOrder._id);
        await patient.save();

        console.log('Med order saved successfully:', savedMedOrder);

        // Return the newly created Med Order as a plain object
        return new NextResponse(JSON.stringify(savedMedOrder.toObject()), { status: 201 });
    } catch (error) {
        console.error('Failed to add med order:', error);
        return new NextResponse(`Failed to add med order: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
    }
};