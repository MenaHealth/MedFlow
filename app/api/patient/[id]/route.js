// app/api/patient/[id]/route.js
import Patient from "@/models/patient";
import dbConnect from "@/utils/database";
import { Types } from "mongoose";

export const GET = async (request, { params }) => {
    try {
        await dbConnect();

        if (!Types.ObjectId.isValid(params.id)) {
            return new Response("Invalid ID", { status: 400 });
        }

        const patient = await Patient.findById(params.id);
        if (!patient) {
            return new Response("Patient Not Found", { status: 404 });
        }

        return new Response(JSON.stringify(patient), { status: 200 });
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
};

export const PATCH = async (request, { params }) => {
    const newPatientData = await request.json();

    try {
        await dbConnect();

        // Validate and convert the id parameter to ObjectId
        if (!Types.ObjectId.isValid(params.id)) {
            return new Response("Invalid ID", { status: 400 });
        }

        // Parse and adjust patient data fields
        newPatientData.age = parseInt(newPatientData.age);
        newPatientData.surgeryDate = new Date(newPatientData.surgeryDate);
        newPatientData.medx = newPatientData.medx ? newPatientData.medx.map((med) => {
            return {
                medName: med.medName,
                medDosage: med.medDosage,
                medFrequency: med.medFrequency,
            };
        }) : [];

        // Update patient by _id
        const updatedPatient = await Patient.findByIdAndUpdate(params.id, { $set: newPatientData }, { new: true, runValidators: true });

        if (!updatedPatient) {
            return new Response(`Patient with ID ${params.id} not found`, { status: 404 });
        }

        return new Response(JSON.stringify(updatedPatient), { status: 200 });
    } catch (error) {
        console.error('Failed to update patient:', error);
        return new Response(`Failed to update patient: ${error.message}`, { status: 500 });
    }
};

export const DELETE = async (request, { params }) => {
    try {
        await dbConnect();

        // Validate and convert the id parameter to ObjectId
        if (!Types.ObjectId.isValid(params.id)) {
            return new Response("Invalid ID", { status: 400 });
        }

        // Delete patient by _id
        const deletedPatient = await Patient.findByIdAndRemove(params.id);

        if (!deletedPatient) {
            return new Response(`Patient with ID ${params.id} not found`, { status: 404 });
        }

        return new Response("Patient deleted successfully", { status: 200 });
    } catch (error) {
        console.error('Error deleting patient:', error);
        return new Response("Error deleting patient", { status: 500 });
    }
};
