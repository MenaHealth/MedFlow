// app/api/patient/new/telegram/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { id, ...updateData } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
        }

        const patient = await Patient.findById(id);

        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        // Update the patient's data
        Object.assign(patient, updateData);
        await patient.save();

        return NextResponse.json({ message: "Patient updated successfully", patient });
    } catch (error) {
        console.error("Error updating patient:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}