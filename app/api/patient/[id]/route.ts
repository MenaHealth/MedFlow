// app/api/patient/[id]/route.ts
// getting + updating patient data + rx orders

import { NextResponse } from 'next/server';
import dbConnect from "@/utils/database";
import Patient, {IRxOrder} from "@/models/patient";
import { Types } from "mongoose";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log("Received request to fetch patient with ID:", params.id); // Log the provided ID

        await dbConnect();

        let patient;

        // Check if the id is a valid ObjectId
        if (Types.ObjectId.isValid(params.id)) {
            patient = await Patient.findById(params.id);
        }

        if (!patient) {
            console.log("No patient found with the provided ID.");
            return NextResponse.json({ error: "Patient Not Found" }, { status: 404 });
        }

        return NextResponse.json({ patient });
    } catch (error) {
        console.error("Error fetching patient:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        console.log("PATCH request received for patient:", params.id);

        const patientId = params.id;
        const requestData = await request.json();

        console.log("Request payload:", requestData);

        // Destructure to check if it's an RX order update
        const { rxOrderId, updatedRxOrder, ...patientUpdateData } = requestData;

        if (rxOrderId && updatedRxOrder) {
            console.log("RX order update detected.");
            console.log("RX Order ID:", rxOrderId);
            console.log("Updated RX Order Data:", updatedRxOrder);

            // **Validation for RX Order**
            if (!updatedRxOrder.RxDispenserName || !updatedRxOrder.RxDispenserContact) {
                console.error("Validation failed: Missing RX Dispenser Name or Contact Info.");
                return NextResponse.json(
                    { error: 'RX dispenser name and contact information are required.' },
                    { status: 400 }
                );
            }

            // **Step 1: Find the patient document**
            const patient = await Patient.findById(patientId);
            if (!patient) {
                console.error(`Patient with ID ${patientId} not found.`);
                return NextResponse.json(
                    { error: 'Patient not found.' },
                    { status: 404 }
                );
            }

            // **Step 2: Locate the RX order within the rxOrders array**
            const rxOrderIndex = patient.rxOrders.findIndex(
                (order: IRxOrder) => order.rxOrderId === rxOrderId
            );

            if (rxOrderIndex === -1) {
                console.error(`RX Order with ID ${rxOrderId} not found for patient ${patientId}.`);
                return NextResponse.json(
                    { error: 'RX order not found.' },
                    { status: 404 }
                );
            }

            console.log("Found RX order at index:", rxOrderIndex);

            // **Step 3: Prepare the updateFields object**
            const updateFields: any = {
                [`rxOrders.${rxOrderIndex}.RxDispenserName`]: updatedRxOrder.RxDispenserName,
                [`rxOrders.${rxOrderIndex}.RxDispenserContact`]: updatedRxOrder.RxDispenserContact,
                [`rxOrders.${rxOrderIndex}.rxStatus`]: updatedRxOrder.rxStatus,
                [`rxOrders.${rxOrderIndex}.submitted`]: updatedRxOrder.submitted,
                [`rxOrders.${rxOrderIndex}.partialRxNotes`]: updatedRxOrder.partialRxNotes,
            };

            // **Step 4: Unset PharmacyQrCode and PharmacyQrUrl if submitted is true**
            if (updatedRxOrder.submitted) {
                console.log("RX order has been submitted. Removing Pharmacy QR Code and URL.");
                updateFields[`rxOrders.${rxOrderIndex}.PharmacyQrCode`] = undefined;
                updateFields[`rxOrders.${rxOrderIndex}.PharmacyQrUrl`] = undefined;
            }

            // **Step 5: Apply the updates using $set**
            const updatedPatient = await Patient.findByIdAndUpdate(
                patientId,
                { $set: updateFields },
                { new: true, runValidators: true }
            );

            if (!updatedPatient) {
                console.error(`Failed to update RX order for patient ID ${patientId}.`);
                return NextResponse.json(
                    { error: 'Failed to update RX order.' },
                    { status: 500 }
                );
            }

            console.log("RX order updated successfully for patient:", updatedPatient._id);
            return NextResponse.json(
                { message: 'RX order updated successfully.', patient: updatedPatient },
                { status: 200 }
            );
        } else {
            console.log("General patient update detected. Updating patient fields.");

            // **General Patient Update Logic**
            console.log("Fields to update:", patientUpdateData);

            const updatedPatient = await Patient.findByIdAndUpdate(
                patientId,
                { $set: patientUpdateData },
                { new: true, runValidators: true }
            );

            if (!updatedPatient) {
                console.error(`Patient with ID ${patientId} not found.`);
                return NextResponse.json({ error: "Patient not found" }, { status: 404 });
            }

            console.log("Patient updated successfully:", updatedPatient._id);
            return NextResponse.json({ patient: updatedPatient }, { status: 200 });
        }

    } catch (error) {
        console.error("Unexpected error while updating patient:", error);
        return NextResponse.json({ error: "Failed to update patient." }, { status: 500 });
    }
}