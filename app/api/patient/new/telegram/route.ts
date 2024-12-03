// app/api/patient/new/telegram/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";

export async function POST(request: Request) {
    try {
        await dbConnect();

        // Extract data from the request body
        const { patientId, ...updateData } = await request.json();

        if (!patientId) {
            return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
        }

        // Check if the patient already exists
        let patient = await Patient.findById(patientId);
        if (!patient) {
            // If patient does not exist, create a new patient
            patient = new Patient({
                _id: patientId,
                ...updateData,
            });
            await patient.save();
        } else {
            // If patient exists, update their data
            Object.assign(patient, updateData);
            await patient.save();
        }

        return NextResponse.json({ message: "Patient created/updated successfully", patient });
    } catch (error) {
        console.error("Error creating/updating patient:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}