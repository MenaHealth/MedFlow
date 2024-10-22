import { NextResponse } from 'next/server';
import Patient from '../../../../../../models/patient';
import RxOrders from '../../../../../../models/rxOrders';
import dbConnect from '../../../../../../utils/database';
import { Types } from 'mongoose';

interface Params {
    params: {
        id: string;
    };
}

export const POST = async (request: Request, { params }: Params) => {
    try {
        const requestData = await request.json();
        console.log('Received request data:', requestData);

        const {
            email,
            date,
            authorName,
            authorID,
            content,
        } = requestData;

        const { patientName, phoneNumber, age, diagnosis, pharmacyOrClinic, doctorSpecialization, prescriptions } = content;

        console.log('Content to be saved:', content);

        await dbConnect();

        const patient = await Patient.findById(params.id);
        if (!patient) {
            return new NextResponse(`Patient with ID ${params.id} not found`, { status: 404 });
        }

        const newRXOrder = new RxOrders({
            email,
            date: date || new Date(),
            authorName,
            authorID,
            content: {
                patientName,
                phoneNumber,
                age,
                diagnosis,
                pharmacyOrClinic,
                doctorSpecialization,
                prescriptions
            }
        });

        console.log('New RX Order to be saved:', newRXOrder);

        patient.rxOrders.push(newRXOrder);
        await patient.save();

        return new NextResponse(JSON.stringify(newRXOrder), { status: 201 });
    } catch (error) {
        console.error('Failed to add RX order:', error);
        return new NextResponse(`Failed to add RX order: ${error.message}`, { status: 500 });
    }
};