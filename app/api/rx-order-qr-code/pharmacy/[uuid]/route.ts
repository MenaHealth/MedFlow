// app/api/rx-order-qr-code/pharmacy/[uuid]/route.ts

import { NextResponse } from 'next/server';
import Patient from '@/models/patient';
import dbConnect from '@/utils/database';
import { IRxOrder } from '@/models/patient';

export const GET = async (request: Request, { params }: { params: { uuid: string } }) => {
    try {
        await dbConnect();

        const { uuid } = params;

        // Find the patient with the RX order matching the PharmacyQrUrl
        const patient = await Patient.findOne({ "rxOrders.PharmacyQrUrl": { $regex: uuid } });
        if (!patient) {
            return new NextResponse(
                JSON.stringify({ error: 'RX order not found: patient' }),
                { status: 404 }
            );
        }

        const rxOrder = patient.rxOrders.find((order: IRxOrder) => order.PharmacyQrUrl?.includes(uuid));
        if (!rxOrder) {
            return new NextResponse(
                JSON.stringify({ error: 'RX order not found: order' }),
                { status: 404 }
            );
        }

        // Include the patientId in the response
        return new NextResponse(
            JSON.stringify({ rxOrder, patientId: patient._id }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error fetching RX order:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch RX order' }),
            { status: 500 }
        );
    }
};

export const PATCH = async (request: Request, { params }: { params: { uuid: string } }) => {
    try {
        await dbConnect();

        const { uuid } = params;
        const updatedData = await request.json();

        // Validate required fields
        if (!updatedData.RxDispenserName || !updatedData.RxDispenserContact) {
            return new NextResponse(
                JSON.stringify({ error: 'RX dispenser name and contact information are required.' }),
                { status: 400 }
            );
        }

        // Find the RX order
        const patient = await Patient.findOne({
            "rxOrders.PharmacyQrUrl": { $regex: uuid },
        });

        if (!patient) {
            return new NextResponse(
                JSON.stringify({ error: 'RX order not found' }),
                { status: 404 }
            );
        }

        const rxOrder = patient.rxOrders.find((order: IRxOrder) => order.PharmacyQrUrl?.includes(uuid));
        if (!rxOrder) {
            return new NextResponse(
                JSON.stringify({ error: 'RX order not found' }),
                { status: 404 }
            );
        }

        if (rxOrder.submitted) {
            return new NextResponse(
                JSON.stringify({ error: 'RX order has already been submitted and cannot be edited.' }),
                { status: 400 }
            );
        }

        // Log the updated data for debugging
        console.log('Updated Data:', updatedData);

        // Update the RX order in the database
        const updatedPatient = await Patient.findOneAndUpdate(
            { "rxOrders.PharmacyQrUrl": { $regex: uuid } },
            {
                $set: {
                    "rxOrders.$[order]": {
                        ...rxOrder,
                        ...updatedData, // Overwrite with updated fields
                    },
                },
            },
            {
                arrayFilters: [{ "order.PharmacyQrUrl": { $regex: uuid } }],
                new: true,
                runValidators: true,
            }
        );

        if (!updatedPatient) {
            return new NextResponse(
                JSON.stringify({ error: 'Failed to update RX order: patient not found' }),
                { status: 404 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: 'RX order updated successfully' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating RX order:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to update RX order' }),
            { status: 500 }
        );
    }
};