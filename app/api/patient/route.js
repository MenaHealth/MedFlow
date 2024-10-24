import Patient from "@/models/patient";
import dbConnect from "@/utils/database";

// Handle GET request to fetch all patients
export const GET = async (request, { params }) => {
    try {
        await dbConnect();
        const patient = await Patient.find();  // Fetch all patients
        return new Response(JSON.stringify(patient), { status: 200 });
    } catch (error) {
        return new Response(`Failed to fetch all patients: ${error}`, { status: 500 });
    }
};

// Handle PATCH request to update a patient's data
export const PATCH = async (request, { params }) => {
    try {
        await dbConnect();  // Ensure the database is connected

        const newPatientData = await request.json();  // Parse the incoming request data

        // Log to check if the priority field is being passed correctly
        console.log("Priority being updated:", newPatientData.priority);

        // Find the patient by ID
        const existingPatient = await Patient.findById(newPatientData._id);

        if (!existingPatient) {
            return new Response("Patient not found", { status: 404 });
        }

        // Update only the fields that are provided (using the spread operator)
        existingPatient.files = newPatientData.files ?? existingPatient.files;
        existingPatient.firstName = newPatientData.firstName ?? existingPatient.firstName;
        existingPatient.lastName = newPatientData.lastName ?? existingPatient.lastName;
        existingPatient.phone = newPatientData.phone ?? existingPatient.phone;
        existingPatient.age = newPatientData.age ?? existingPatient.age;
        existingPatient.dob = newPatientData.dob ?? existingPatient.dob;
        existingPatient.country = newPatientData.country ?? existingPatient.country;
        existingPatient.city = newPatientData.city ?? existingPatient.city;
        existingPatient.language = newPatientData.language ?? existingPatient.language;
        existingPatient.genderPreference = newPatientData.genderPreference ?? existingPatient.genderPreference;
        existingPatient.chiefComplaint = newPatientData.chiefComplaint ?? existingPatient.chiefComplaint;
        existingPatient.email = newPatientData.email ?? existingPatient.email;
        existingPatient.priority = newPatientData.priority ?? existingPatient.priority;  // Ensure priority is updated
        existingPatient.specialty = newPatientData.specialty ?? existingPatient.specialty;
        existingPatient.hospital = newPatientData.hospital ?? existingPatient.hospital;
        existingPatient.status = newPatientData.status ?? existingPatient.status;
        existingPatient.triagedBy = newPatientData.triagedBy ?? existingPatient.triagedBy;
        existingPatient.notes = newPatientData.notes ?? existingPatient.notes;
        existingPatient.doctor = newPatientData.doctor ?? existingPatient.doctor;

        // Handle assigned doctor and coordinator population
        if (newPatientData.assignedDocId) {
            existingPatient.assignedDocId = newPatientData.assignedDocId === "unassign" ? null : newPatientData.assignedDocId;
            await existingPatient.populate("assignedDocId");
        }
        if (newPatientData.coordinatorId) {
            existingPatient.coordinatorId = newPatientData.coordinatorId === "unassign" ? null : newPatientData.coordinatorId;
            await existingPatient.populate("coordinatorId");
        }

        // Save the updated patient document to the database
        await existingPatient.save();

        // Return the updated patient
        return new Response(JSON.stringify(existingPatient), { status: 200 });

    } catch (error) {
        console.error(`Error Updating Patient: ${error}`);
        return new Response(`Error Updating Patient: ${error}`, { status: 500 });
    }
};

// Handle POST request to fetch patients by assigned doctor ID and clinics
export const POST = async (request, { params }) => {
    try {
        await dbConnect();  // Ensure the database is connected

        const { assignedDocId, clinics } = await request.json();  // Parse the request

        // Fetch patients by assigned doctor ID and populate related fields
        const patientData = await Patient.find({ assignedDocId })
            .populate("coordinatorId")
            .populate("assignedDocId");

        // Count patients by clinic
        const clinicCounts = {};
        for (let clinic of clinics) {
            const countQuery = { assignedClinic: clinic, assignedDocId: null };
            const count = await Patient.countDocuments(countQuery);
            clinicCounts[clinic] = count;
        }

        // Return the patient data and clinic counts
        return new Response(JSON.stringify({ patientData, clinicCounts }), { status: 200 });

    } catch (error) {
        console.error(`Failed to fetch patients: ${error}`);
        return new Response(`Failed to fetch patients: ${error}`, { status: 500 });
    }
};
