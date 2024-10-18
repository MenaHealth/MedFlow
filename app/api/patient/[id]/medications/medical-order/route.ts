// app/api/patient/[id]/medications/medical-order/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { db } = await connectToDatabase();
        const patientId = params.id;
        const rxFormData = await req.json();

        const result = await db.collection('patients').updateOne(
            { _id: new ObjectId(patientId) },
            { $push: { RXForms: rxFormData } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ error: 'Failed to add RX Form' }, { status: 400 });
        }

        return NextResponse.json({ message: 'RX Form added successfully' });
    } catch (error) {
        console.error('Error adding RX Form:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}