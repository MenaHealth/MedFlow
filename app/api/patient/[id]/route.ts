// app/api/patient/[id]/route.ts
import Patient from "./../../../../models/patient";
import dbConnect from "./../../../../utils/database";
import { Types } from "mongoose";


interface Params {
    params: {
        id: string;
    };
}

export const GET = async (request: Request, { params }: Params) => {
    try {
        await dbConnect();

        // Validate ID
        if (!Types.ObjectId.isValid(params.id)) {
            return new Response("Invalid ID", { status: 400 });
        }

        const patient = await Patient.findById(params.id);
        if (!patient) {
            return new Response("Patient Not Found", { status: 404 });
        }

  
        const responsePayload = {
            firstName: patient.firstName,
            lastName: patient.lastName,
            phone: patient.phone,
            dob: patient.dob,
            genderPreference: patient.genderPreference,
            country: patient.country,
            city: patient.city,
            language: patient.language,
            telegramChatId: patient.telegramChatId || "",
        };

        return new Response(JSON.stringify(responsePayload), { status: 200 });
    } catch (error) {
        console.error("Error fetching patient:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
};

export const PATCH = async (request: Request, { params }: Params) => {
    const newPatientData = await request.json();

    try {
        await dbConnect();

        if (!Types.ObjectId.isValid(params.id)) {
            return new Response("Invalid ID", { status: 400 });
        }

        const updatedPatient = await Patient.findByIdAndUpdate(params.id, { $set: newPatientData }, { new: true, runValidators: true });
        if (!updatedPatient) {
            return new Response("Patient not found", { status: 404 });
        }

        return new Response(JSON.stringify(updatedPatient), { status: 200 });
    } catch (error) {
        console.error("Failed to update patient:", error);
        return new Response("Failed to update patient", { status: 500 });
    }
};