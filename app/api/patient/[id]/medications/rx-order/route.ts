// app/api/patient/[id]/medications/rx-order/route.ts

import { NextResponse } from 'next/server';
import MedOrders from '../../../../../../models/medOrders';
import dbConnect from './../../../../../../utils/database';

export const POST = async (request: Request) => {
    try {
        await dbConnect();

        const requestData = await request.json();
        console.log('Received request data:', requestData);

        const {
            email,
            authorName,
            authorID,
            doctorSpecialization,
            Rx: {validTill, prescriptions }
        } = requestData;

        if (!doctorSpecialization || !prescriptions || prescriptions.length === 0) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const newMedOrder = {
            email,
            authorName,
            authorID,
            doctorSpecialization,
            validTill,
            prescriptions, // This is the array of medications we now handle
            date: new Date(),
        };

        // Save the new medical order in the MedOrders collection
        const saveRxOrder = await MedOrders.create(newMedOrder);

        if (!saveRxOrder) {
            return new NextResponse('Failed to save medical order', { status: 500 });
        }

        return new NextResponse(JSON.stringify(saveRxOrder), { status: 201 });
    } catch (error) {
        console.error('Failed to add rx order:', error);
        return new NextResponse('Failed to add rx order', { status: 500 });
    }
};