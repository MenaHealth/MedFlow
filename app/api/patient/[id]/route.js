// app/api/patient/new/route.js
import Patient from "@/models/patient";
import dbConnect from "@/utils/database";

export const GET = async (request, { params }) => {
    try {
        await dbConnect();
        const patient = await Patient.findOne({ patientId: params.id });
        if (!patient) {
            return new Response("Patient Not Found", { status: 404 });
        }
        return new Response(JSON.stringify(patient), { status: 200 });
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}

export const PATCH = async (request, { params }) => {
    const newPatientData = await request.json();

    try {
        await dbConnect();

        // Handle surgeryDate only if provided
        if (newPatientData.surgeryDate) {
            const surgeryDate = new Date(newPatientData.surgeryDate);
            if (!isNaN(surgeryDate.getTime())) {
                newPatientData.surgeryDate = surgeryDate;
            } else {
                throw new Error("Invalid surgery date provided");
            }
        }

        // Handle medx only if provided
        if (newPatientData.medx) {
            newPatientData.medx = newPatientData.medx.map((med) => {
                return {
                    medName: med.medName,
                    medDosage: med.medDosage,
                    medFrequency: med.medFrequency,
                };
            });
        }

        // Convert age to a number if it's provided
        if (newPatientData.age) {
            newPatientData.age = parseInt(newPatientData.age);
        }

        const updatedPatient = await Patient.findOneAndUpdate({ patientId: params.id }, { $set: newPatientData }, { new: true, runValidators: true });

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
        await Patient.findOneAndRemove({ patientId: params.id });
        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Error deleting prompt", { status: 500 });
    }
};