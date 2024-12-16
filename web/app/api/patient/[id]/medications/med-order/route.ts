// app/api/patient/[id]/medications/med-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import MedOrder from '../../../../../../models/medOrder';
import Patient from '../../../../../../models/patient';
import dbConnect from '../../../../../../utils/database';
import { Types } from 'mongoose';

async function fetchMedOrders(medOrderIds: string[]) {
    return await MedOrder.find({
        _id: { $in: medOrderIds.map(id => new Types.ObjectId(id)) },
    });
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const medOrderIds = request.nextUrl.searchParams.get('ids')?.split(',') || [];

    try {
        const medOrderDetails = await fetchMedOrders(medOrderIds);
        return NextResponse.json(medOrderDetails);
    } catch (error) {
        console.error("Failed to fetch med orders:", error);
        return NextResponse.json({ error: "Failed to fetch med orders" }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const patientId = params.id;
    const requestData = await request.json();

    if (requestData.medOrderIds && Array.isArray(requestData.medOrderIds)) {
        try {
            const medOrderDetails = await fetchMedOrders(requestData.medOrderIds);
            return NextResponse.json(medOrderDetails);
        } catch (error) {
            console.error("Failed to fetch med orders:", error);
            return NextResponse.json({ error: "Failed to fetch med orders" }, { status: 500 });
        }
    }

    try {
        const {
            doctorSpecialty, prescribingDr, drEmail, drId, patientName,
            patientPhone, patientCity, patientCountry, orderDate, validated, medications
        } = requestData;

        const isValid = Types.ObjectId.isValid(patientId) &&
            [doctorSpecialty, prescribingDr, drEmail, drId, patientName, patientPhone, patientCity, patientCountry].every(field => typeof field === 'string') &&
            Array.isArray(medications) &&
            medications.every(med => ['diagnosis', 'medication', 'dosage', 'frequency', 'quantity'].every(prop => typeof med[prop] === 'string'));

        if (!isValid) {
            return NextResponse.json({ error: "Invalid med order data" }, { status: 400 });
        }

        const newMedOrder = new MedOrder({
            ...requestData,
            patientId: new Types.ObjectId(patientId),
            orderDate: orderDate || new Date(),
            validated: validated || false
        });

        const savedMedOrder = await newMedOrder.save();

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        patient.medOrders.push(savedMedOrder._id);
        await patient.save();

        return NextResponse.json(savedMedOrder.toObject(), { status: 201 });
    } catch (error) {
        console.error('Failed to add med order:', error);
        return NextResponse.json({ error: "Failed to add med order" }, { status: 500 });
    }
}