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

        // Individual logging to identify which field fails validation
        console.log("Validation Check - patientId:", Types.ObjectId.isValid(patientId));
        console.log("Validation Check - doctorSpecialty:", typeof doctorSpecialty === 'string', doctorSpecialty);
        console.log("Validation Check - prescribingDr:", typeof prescribingDr === 'string', prescribingDr);
        console.log("Validation Check - drEmail:", typeof drEmail === 'string', drEmail);
        console.log("Validation Check - drId:", typeof drId === 'string', drId);
        console.log("Validation Check - patientName:", typeof patientName === 'string', patientName);
        console.log("Validation Check - patientPhone:", typeof patientPhone === 'string', patientPhone);
        console.log("Validation Check - patientCity:", typeof patientCity === 'string', patientCity);
        console.log("Validation Check - medications array:", Array.isArray(medications), medications);

        // Check that required fields are present and of correct type
        const hasInvalidMedications = medications.some(med => {
            console.log("Validating medication entry:", med);
            return (
                typeof med.diagnosis !== 'string' ||
                typeof med.medication !== 'string' ||
                typeof med.dosage !== 'string' ||
                typeof med.frequency !== 'string' ||
                typeof med.quantity !== 'string'
            );
        });

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
            console.error("Validation failed for med order data:", {
                patientId,
                doctorSpecialty,
                prescribingDr,
                drEmail,
                drId,
                patientName,
                patientPhone,
                patientCity,
                medications
            });
            return new NextResponse("Invalid med order data", { status: 400 });
        }

        // Create the new Med Order document
        console.log("Creating new MedOrder document with:", {
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
        });

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

        // Embed or reference the MedOrder in the Patient model
        const patient = await Patient.findById(patientId);
        if (!patient) {
            console.error("Patient not found:", patientId);
            return new NextResponse("Patient not found", { status: 404 });
        }

        // Initialize or add the MedOrder reference
        if (!patient.medOrders) {
            patient.medOrders = [];
        }

        patient.medOrders.push(savedMedOrder._id);
        await patient.save();

        console.log('Med order reference added to Patient record:', patientId);

        // Return the newly created Med Order as a plain object
        return new NextResponse(JSON.stringify(savedMedOrder.toObject()), { status: 201 });
    } catch (error) {
        console.error('Failed to add med order:', error);
        return new NextResponse(`Failed to add med order: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
    }
};