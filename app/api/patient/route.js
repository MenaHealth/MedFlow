import Patient from "@/models/patient";
import { connectToDB } from "@/utils/database";

export const GET = async (request) => {
    try {
        await connectToDB()

        const patient = await Patient.find({}).populate("coordinatorId").populate("assignedDocId")

        return new Response(JSON.stringify(patient), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch all patients", { status: 500 })
    }
}

export const PATCH = async (request, { params }) => {

    const { 
        _id,
        name,
        status,
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
        existingPatient.name = name ?? existingPatient.name;
        existingPatient.status = status ?? existingPatient.status;
        existingPatient.assignedClinic = assignedClinic ?? existingPatient.assignedClinic;
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