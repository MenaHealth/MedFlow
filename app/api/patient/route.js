import Patient from "@/models/patient";
import { connectToDB } from "@/utils/database";

export const GET = async (request, { params }) => {
    try {
        await connectToDB();
        
        // return all patients
        const patient = await Patient.find();
        return new Response(JSON.stringify(patient), { status: 200 })
    } catch (error) {
        return new Response(`Failed to fetch all patients: ${error} ${JSON.stringify(request)} ${JSON.stringify(params)}`, { status: 500 })
    }
}

export const PATCH = async (request, { params }) => {

    const { 
        _id,
        name,
        priority,
        specialty,
        hospital,
        assignedClinic,
        assignedDocId,
        coordinatorId,
    } = await request.json();

    try {
        await connectToDB();

        const existingPatient = await Patient.findById(_id);

        if (!existingPatient) {
            return new Response("Patient not found", { status: 404 });
        }
        let returnId = null;

        existingPatient.priority = priority ?? existingPatient.priority;
        existingPatient.specialty = specialty ?? existingPatient.specialty;
        existingPatient.hospital = hospital ?? existingPatient.hospital;

        if (assignedDocId) {
            existingPatient.assignedDocId = assignedDocId === "unassign" ? null : assignedDocId;
            await existingPatient.populate("assignedDocId");
            returnId = existingPatient.assignedDocId;
        }
        if (coordinatorId) {
            existingPatient.coordinatorId = coordinatorId === "unassign" ? null : coordinatorId;
            await existingPatient.populate("coordinatorId");
            returnId = existingPatient.coordinatorId;
        }

        await existingPatient.save();

        return new Response(JSON.stringify(returnId), { status: 200 });
    } catch (error) {
        return new Response(`Error Updating Patient: ${error}`, { status: 500 });
    }
};

export const POST = async (request, { params }) => {
    try {
        await connectToDB();

        const { assignedDocId, clinics } = await request.json();

        const patientData = await Patient.find({assignedDocId})
                                        .populate("coordinatorId")
                                        .populate("assignedDocId");
        const clinicCounts = {};
        for (let clinic of clinics) {
            const countQuery = {assignedClinic : clinic, assignedDocId: null};
            const count = await Patient.countDocuments(countQuery);
            clinicCounts[clinic] = count;
        }
        return new Response(JSON.stringify({patientData, clinicCounts}), { status: 200 });
    } catch (error) {
        return new Response(`Failed to fetch patients: ${error}`, { status: 500 });
    }
}