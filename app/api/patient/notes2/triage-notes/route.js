// app/api/patient/[id]/notes2/triage-notes2/route.ts

import { NextResponse } from 'next/server';
import Patient from "@/models/patient";
import { Note } from "@/models/note";
import dbConnect from "@/utils/database";
import { Types } from "mongoose";

export async function POST(request, { params }) {
    const { id } = params;
    const { content, email, authorName, authorID } = await request.json();

    try {
        await dbConnect();

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const newNote = new Note({
            noteType: 'triage',
            date: new Date(),
            content,
            email,
            authorName,
            authorID,
        });

        const patient = await Patient.findById(id);
        if (!patient) {
            return NextResponse.json({ error: `Patient with ID ${id} not found` }, { status: 404 });
        }

        patient.notes.push(newNote);
        await patient.save();

        return NextResponse.json(newNote, { status: 201 });
    } catch (error) {
        console.error('Failed to add triage note:', error);
        return NextResponse.json({ error: `Failed to add triage note: ${error.message}` }, { status: 500 });
    }
}