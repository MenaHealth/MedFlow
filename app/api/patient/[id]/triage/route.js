// app/api/patient/[id]/triage/route.js
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";
import { Note } from "@/models/note";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
    const { id } = params;
    const { specialty, priority, status, noteContent, noteType, authorName, authorID, email } = await req.json();

    await dbConnect();

    // Validate patient ID
    if (!ObjectId.isValid(id)) {
        console.error("Invalid patient ID:", id);
        return new Response(JSON.stringify({ message: "Invalid patient ID format." }), { status: 400 });
    }

    try {
        // Find the patient by ID
        const patient = await Patient.findById(id);
        if (!patient) {
            return new Response(JSON.stringify({ message: "Patient not found." }), { status: 404 });
        }

        // Update patient fields
        patient.specialty = specialty;
        patient.priority = priority;
        patient.status = status;
        patient.updatedAt = new Date();

        const newNote = new Note({
            noteType,
            date: new Date(),
            content: {
                triageDetails: noteContent
            },
            email,
            authorName,
            authorID,
        });

        // Add the new note to the patient's notes array
        patient.notes.push(newNote);

        // Save the updated patient document
        await patient.save();

        return new Response(JSON.stringify({ message: "Patient updated successfully!", patient }), { status: 200 });
    } catch (error) {
        console.error("Error updating patient:", error);
        return new Response(JSON.stringify({ message: "Failed to update patient.", error: error.message }), { status: 500 });
    }
}