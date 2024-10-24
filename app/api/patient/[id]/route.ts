import Patient from "./../../../../models/patient";
import dbConnect from "./../../../../utils/database";
import { Types } from "mongoose";

// Define the type for params
interface Params {
    params: {
        id: string;
    };
}

// Combined PATCH handler
export const PATCH = async (request: Request, { params }: Params) => {
    const newPatientData = await request.json();

    // Log priority being updated
    console.log("Priority being updated:", newPatientData.priority);
    
    try {
        await dbConnect();

        // Validate ID
        if (!Types.ObjectId.isValid(params.id)) {
            return new Response("Invalid ID", { status: 400 });
        }

        // Find and update the patient
        const updatedPatient = await Patient.findByIdAndUpdate(
            params.id,
            { $set: newPatientData },
            { new: true, runValidators: true }
        );

        if (!updatedPatient) {
            return new Response("Patient not found", { status: 404 });
        }

        return new Response(JSON.stringify(updatedPatient), { status: 200 });
    } catch (error) {
        console.error("Failed to update patient:", error);
        return new Response("Failed to update patient", { status: 500 });
    }
};
