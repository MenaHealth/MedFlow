// app/api/patient/[id]/route.js





import Patient from "@/models/patient";
import { Note } from "@/models/note";
import dbConnect from "@/utils/database";
import { Types } from "mongoose";

export const GET = async (request, { params }) => {
    try {
        await dbConnect();

        if (!Types.ObjectId.isValid(params.id)) {
            return new Response("Invalid ID", { status: 400 });
        }

        const patient = await Patient.findById(params.id).populate({
            path: 'notes',
            model: Note,
            options: { sort: { 'date': -1 } }
        });

        if (!patient) {
            return new Response("Patient Not Found", { status: 404 });
        }

        console.log("Patient data:", patient); // Log the patient data

        const patientData = patient.toObject();

        if (!patientData.notes) {
            console.log("Notes are undefined for patient:", patientData._id);
            patientData.notes = []; // Set to empty array if undefined
        } else {
            console.log("Number of notes:", patientData.notes.length); // Log the number of notes
            patientData.notes = patientData.notes.map(note => {
                console.log("Processing note:", note); // Log each note
                return {
                    _id: note._id.toString(),
                    title: note.noteType || 'Note',
                    email: note.email,
                    date: new Date(note.date).toISOString(),
                    content: getContentForNoteType(note),
                };
            });
        }

        return new Response(JSON.stringify(patientData), { status: 200 });
    } catch (error) {
        console.error("Error fetching patient:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
};

export const PATCH = async (request, { params }) => {
    const newPatientData = await request.json();

    try {
        await dbConnect();

        if (!Types.ObjectId.isValid(params.id)) {
            return new Response("Invalid ID", { status: 400 });
        }

        newPatientData.age = parseInt(newPatientData.age);
        newPatientData.surgeryDate = new Date(newPatientData.surgeryDate);
        newPatientData.medx = newPatientData.medx ? newPatientData.medx.map((med) => {
            return {
                medName: med.medName,
                medDosage: med.medDosage,
                medFrequency: med.medFrequency,
            };
        }) : [];

        const updatedPatient = await Patient.findByIdAndUpdate(
            params.id,
            { $set: newPatientData },
            { new: true, runValidators: true }
        ).populate({
            path: 'notes',
            model: Note,
            options: { sort: { 'date': -1 } }
        });

        if (!updatedPatient) {
            return new Response(`Patient with ID ${params.id} not found`, { status: 404 });
        }

        const patientData = updatedPatient.toObject();

        if (!patientData.notes) {
            patientData.notes = [];
        } else {
            patientData.notes = patientData.notes.map(note => ({
                _id: note._id.toString(),
                title: note.noteType || 'Note',
                email: note.email,
                date: new Date(note.date).toISOString(),
                content: getContentForNoteType(note),
            }));
        }

        return new Response(JSON.stringify(patientData), { status: 200 });
    } catch (error) {
        console.error('Failed to update patient:', error);
        return new Response(`Failed to update patient: ${error.message}`, { status: 500 });
    }
};

export const POST = async (request, { params }) => {
    const updateData = await request.json();

    try {
        await dbConnect();

        if (!Types.ObjectId.isValid(params.id)) {
            return new Response("Invalid ID", { status: 400 });
        }

        const newNote = {
            noteType: updateData.noteType,
            date: new Date(updateData.date),
            email: updateData.email,
            subjective: updateData.subjective,
            objective: updateData.objective,
            assessment: updateData.assessment,
            plan: updateData.plan
        };

        // Ensure notes is an array before updating
        const patient = await Patient.findById(params.id);
        if (!patient) {
            return new Response(`Patient with ID ${params.id} not found`, { status: 404 });
        }

        // Convert notes to an array if it's not already one
        if (!Array.isArray(patient.notes)) {
            patient.notes = [];
        }

        patient.notes.push(newNote);
        await patient.save();

        return new Response(JSON.stringify(patient), { status: 200 });
    } catch (error) {
        console.error('Failed to update patient with new note:', error);
        return new Response(`Failed to update patient: ${error.message}`, { status: 500 });
    }
};

export const DELETE = async (request, { params }) => {
    try {
        await dbConnect();

        if (!Types.ObjectId.isValid(params.id)) {
            return new Response("Invalid ID", { status: 400 });
        }

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

function getContentForNoteType(note) {
    switch (note.noteType) {
        case 'physician':
            return note.hpi || '';
        case 'procedure':
            return note.notes || '';
        case 'subjective':
            return `${note.subjective}\n${note.objective}\n${note.assessment}\n${note.plan}`;
        default:
            return '';
    }
}

export const dynamic = 'force-dynamic';