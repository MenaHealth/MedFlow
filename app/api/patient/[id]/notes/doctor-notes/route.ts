// app/api/patient/[id]/notes/doctor-notes/route.ts

import { NextResponse } from 'next/server';
import Patient from "./../../../../../../models/patient";
import { Note, INote } from "./../../../../../../models/note";
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
    const { noteType, content, email, authorName, authorID, draft } = await request.json();

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
            draft
        });

        // Find the patient by ID
        const patient = await Patient.findById(params.id);
        if (!patient) {
            return new Response(`Patient with ID ${params.id} not found`, { status: 404 });
        }

        // Add the new note to the patient's notes array
        patient.notes.push(newNote);

        // Save only the notes array in the patient model
        await Patient.updateOne(
            { _id: params.id },
            { $set: { notes: patient.notes } }
        );

        // Return the new note as the response
        return new Response(JSON.stringify(newNote), { status: 201 });
    } catch (error) {
        console.error('Failed to add doctor note:', error);
        if (error instanceof Error) {
            return new Response(`Failed to add doctor note: ${error.message}`, { status: 500 });
        } else {
            return new Response('Failed to add doctor note due to an unknown error', { status: 500 });
        }
    }
};

export const PATCH = async (request: Request, { params }: Params) => {
    const altRequest = request.clone();
    const { noteId, noteType, content, email, authorName, authorID, draft } = await request.json();
    try {
        await dbConnect();
        // Validate patient ID
        if (!Types.ObjectId.isValid(params.id)) {
            return new Response("Invalid ID", { status: 400 });
        }
        
        const patient = await Patient.findById(params.id);
        if (!patient) {
            return new Response(`Patient with ID ${params.id} not found`, { status: 404 });
        }
        console.log('Patient:', patient);
        console.log(noteId)
        console.log(noteType)
        console.log(content)
        console.log(email)
        console.log(authorName)
        console.log(authorID)
        console.log(draft)
        const noteIndex = patient.notes.findIndex((note: INote) => note._id.toString() === noteId);
        console.log('Note index:', noteIndex);
        console.log(noteIndex === -1)
        if (noteIndex === -1) {
            return await POST(altRequest, { params  });       
        }
        console.log('Note index:', noteIndex);
        patient.notes[noteIndex].noteType = noteType;
        patient.notes[noteIndex].content = content;
        patient.notes[noteIndex].email = email;
        patient.notes[noteIndex].authorName = authorName;
        patient.notes[noteIndex].authorID = authorID;
        patient.notes[noteIndex].draft = draft;
        await patient.save();
        return new Response(JSON.stringify(patient), { status: 200 });
    } catch (error) {
        console.error('Failed to update doctor note:', error);
        if (error instanceof Error) {
            return new Response(`Failed to update doctor note: ${error.message}`, { status: 500 });
        } else {
            return new Response('Failed to update doctor note due to an unknown error', { status: 500 });
        }
    }
}

export const DELETE = async (request: Request, { params }: Params) => {
    const { noteId } = await request.json();
    try {
        await dbConnect();
        // Validate patient ID
        if (!Types.ObjectId.isValid(params.id)) {
            return new Response("Invalid ID", { status: 400 });
        }
        
        const patient = await Patient.findById(params.id);
        if (!patient) {
            return new Response(`Patient with ID ${params.id} not found`, { status: 404 });
        }
        const noteIndex = patient.notes.findIndex((note: INote) => note._id.toString() === noteId);
        if (noteIndex === -1) {
            return new Response(`Note with ID ${noteId} not found`, { status: 404 });
        }
        patient.notes.splice(noteIndex, 1);
        await patient.save();
        return new Response(JSON.stringify(patient), { status: 200 });
    } catch (error) {
        console.error('Failed to delete doctor note:', error);
        if (error instanceof Error) {
            return new Response(`Failed to delete doctor note: ${error.message}`, { status: 500 });
        } else {
            return new Response('Failed to delete doctor note due to an unknown error', { status: 500 });
        }
    }
}