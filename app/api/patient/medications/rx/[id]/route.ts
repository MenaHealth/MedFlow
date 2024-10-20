// app/api/patient/medications/rx/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import Patient from '@/models/patient';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id: patientId } = params;
    const { title, content, createdBy, createdAt } = await request.json();

    try {
        const patient = await Patient.findById(patientId);

        if (!patient) {
            return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
        }

        const rxForm = JSON.parse(content);
        patient.rxOrders.push({
            title,
            content: rxForm,
            createdBy,
        });
        await patient.save();

        return NextResponse.json(patient, { status: 201 });
    } catch (error) {
        console.error('Error adding RX form:', error);
        return NextResponse.json({ message: 'Failed to add RX form' }, { status: 500 });
    }
}