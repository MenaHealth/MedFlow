import Patient from "@/models/patient";
import { connectToDB } from "@/utils/database";

export const GET = async (request, { params }) => {
    try {
        await connectToDB();
        const patient = await Patient.findById(params.id)
        if (!patient) {
            return new Response("Patient Not Found", { status: 404 });
        }
        return new Response(JSON.stringify(patient), { status: 200 })

    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}

export const PATCH = async (request, { params }) => {
    const newPatientData = await request.json();

    try {
        await connectToDB();

        // Update existing patient
        newPatientData.age = parseInt(newPatientData.age);
        newPatientData.surgeryDate = new Date(newPatientData.surgeryDate);
        newPatientData.medx = newPatientData.medx ? newPatientData.medx.map((med) => {
            return {
            medName: med.medName,
            medDosage: med.medDosage,
            medFrequency: med.medFrequency,
            };
        }) : [];
        const updatedPatient = await Patient.findByIdAndUpdate(params.id, { $set: newPatientData}, { new: true, runValidators: true });

        if (!updatedPatient) {
            return new Response(`Patient with ID ${patientId} not found`, { status: 404 });
        }

        return new Response(JSON.stringify(updatedPatient), { status: 200 });
    } catch (error) {
        console.error('Failed to update patient:', error);
        return new Response(`Failed to update patient: ${error}`, { status: 500 });
    }
};

// FIXME
export const DELETE = async (request, { params }) => {
    try {
        await connectToDB();

        // Find the prompt by ID and remove it
        await User.findByIdAndRemove(params.id);

        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Error deleting prompt", { status: 500 });
    }
};
