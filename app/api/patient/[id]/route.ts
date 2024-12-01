// app/api/patient/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";
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
            console.log("ID is a valid ObjectId. Searching by ID...");
            patient = await Patient.findById(params.id);
        }

        // If patient not found and id is not a valid ObjectId, try to find by telegramChatId as fallback
        if (!patient && !Types.ObjectId.isValid(params.id)) {
            console.log("ID is not a valid ObjectId. Searching by telegramChatId...");
            patient = await Patient.findOne({ telegramChatId: params.id });
        }

        if (!patient) {
            console.log("No patient found with the provided ID or telegramChatId.");
            return NextResponse.json({ error: "Patient Not Found" }, { status: 404 });
        }

        // Log patient details for debugging
        console.log("Patient found:", {
            firstName: patient.firstName,
            lastName: patient.lastName,
            phone: patient.phone,
            telegramChatId: patient.telegramChatId,
        });

        return NextResponse.json({ patient });
    } catch (error) {
        console.error("Error fetching patient:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const newPatientData = await request.json();

    try {
        await dbConnect();

        let updatedPatient;

        if (Types.ObjectId.isValid(params.id)) {
            updatedPatient = await Patient.findByIdAndUpdate(params.id, { $set: newPatientData }, { new: true, runValidators: true });
        }

        // If patient not found and id is not a valid ObjectId, try to update by telegramChatId as fallback
        if (!updatedPatient && !Types.ObjectId.isValid(params.id)) {
            updatedPatient = await Patient.findOneAndUpdate({ telegramChatId: params.id }, { $set: newPatientData }, { new: true, runValidators: true });
        }

        if (!updatedPatient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        return NextResponse.json({ patient: updatedPatient });
    } catch (error) {
        console.error("Failed to update patient:", error);
        return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
    }
}

