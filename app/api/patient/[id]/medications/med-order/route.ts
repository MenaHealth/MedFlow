// app/api/patient/[id]/medications/med-order/route.ts

import { NextResponse } from 'next/server';
import MedOrder from '../../../../../../models/medOrder';
import Patient from '../../../../../../models/patient';
import dbConnect from '../../../../../../utils/database';
import { Types } from 'mongoose';

export const POST = async (request: Request, { params }: { params: { id: string } }) => {
    await dbConnect();

    const patientId = params.id;
    const requestData = await request.json();

    // Check if request is for fetching detailed med orders
    if (requestData.medOrderIds && Array.isArray(requestData.medOrderIds)) {
        try {
            console.log("Fetching detailed med orders for ids:", requestData.medOrderIds);

            const medOrderDetails = await MedOrder.find({
                _id: { $in: requestData.medOrderIds.map((id: string) => new Types.ObjectId(id)) },
            });

            return new NextResponse(JSON.stringify(medOrderDetails), { status: 200 });
        } catch (error) {
            console.error("Failed to fetch detailed med orders:", error);
            return new NextResponse(`Failed to fetch med orders: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
        }
    }

    // Handle new med order creation
    try {
        console.log('Received med order data:', requestData);

        const {
            doctorSpecialty,
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

        const hasInvalidMedications = medications.some((med: { diagnosis: string; medication: string; dosage: string; frequency: string; quantity: string }) => (
            typeof med.diagnosis !== 'string' ||
            typeof med.medication !== 'string' ||
            typeof med.dosage !== 'string' ||
            typeof med.frequency !== 'string' ||
            typeof med.quantity !== 'string'
        ));

        if (
            !Types.ObjectId.isValid(patientId) ||
            typeof doctorSpecialty !== 'string' ||
            typeof prescribingDr !== 'string' ||
            typeof drEmail !== 'string' ||
            typeof drId !== 'string' ||
            typeof patientName !== 'string' ||
            typeof patientPhone !== 'string' ||
            typeof patientCity !== 'string' ||
            !Array.isArray(medications) ||
            hasInvalidMedications
        ) {
            return new NextResponse("Invalid med order data", { status: 400 });
        }

        const newMedOrder = new MedOrder({
            doctorSpecialty,
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
        console.log('Med order saved to MedOrder collection:', savedMedOrder);

        // Reference the new MedOrder in the Patient model
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return new NextResponse("Patient not found", { status: 404 });
        }

        patient.medOrders.push(savedMedOrder._id);
        await patient.save();

        return new NextResponse(JSON.stringify(savedMedOrder.toObject()), { status: 201 });
    } catch (error) {
        console.error('Failed to add med order:', error);
        return new NextResponse(`Failed to add med order: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
    }
};