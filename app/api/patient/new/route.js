import Patient from "@/models/patient";
import { connectToDB } from "@/utils/database";

export const POST = async (request) => {
    const { 
        name,
        birthDate,
        location,
        govtId,
        complaint,
        contactNo,
        status,
        coordinatorId,
        assignedClinic,
        assignedDocId,
        admittedDate,
    } = await request.json();

    try {
        await connectToDB();
        const newPatient = new Patient({
            name,
            birthDate,
            location,
            govtId,
            complaint,
            contactNo,
            status,
            coordinatorId,
            assignedClinic,
            assignedDocId,
            admittedDate,
        });

        await newPatient.save();
        return new Response(JSON.stringify(newPatient), { status: 201 })
    } catch (error) {
        return new Response(`Failed to create a new patient: ${error}`, { status: 500 });
    }
}
