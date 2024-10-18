// app/api/patient/[id]/notes/doctor-notes/route.ts

import { NextResponse } from 'next/server';
import Patient from "./../../../../../../models/patient";
import { Note } from "./../../../../../../models/note";
import dbConnect from "./../../../../../../utils/database";
import { Types } from "mongoose";

// Define the type for params
interface Params {
    params: {
        id: string;
    };
}

// POST method to add a new note
export const POST = async (request: Request, { params }: Params) => {
    const { noteType, content, email, authorName, authorID } = await request.json();

    try {
        await dbConnect();

        // Validate patient ID
        if (!Types.ObjectId.isValid(params.id)) {
            return new Response("Invalid ID", { status: 400 });
        }

        // Create new note
        const newNote = new Note({
            noteType,
            date: new Date(),
            content,
            email,
            authorName,
            authorID,
        });

        // Find the patient by ID
        const patient = await Patient.findById(params.id);
        if (!patient) {
            return new Response(`Patient with ID ${params.id} not found`, { status: 404 });
        }

        // Add the note to the patient's notes array
        patient.notes.push(newNote);
        await patient.save();

        // Return the new note as the response
        return new Response(JSON.stringify(newNote), { status: 201 });
    } catch (error) {
        console.error('Failed to add doctor note:', error);
        return new Response(`Failed to add doctor note: ${error.message}`, { status: 500 });
    }
};