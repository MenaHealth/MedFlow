// app/api/patient/[id]/notes2/doctor-notes2/route.ts

import { NextResponse } from 'next/server';
import Patient from "@/models/patient";
import { Note } from "@/models/note";
import dbConnect from "@/utils/database";
import { Types } from "mongoose";

export async function POST(request, { params }) {
    const { id } = params;
    const { noteType, content, email, authorName, authorID } = await request.json();

    try {
        await dbConnect();

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const newNote = new Note({
            noteType,
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
        console.error('Failed to add doctor note:', error);
        return NextResponse.json({ error: `Failed to add doctor note: ${error.message}` }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    const { noteId, content } = await request.json();

    try {
        await dbConnect();

        if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(noteId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const patient = await Patient.findById(id);
        if (!patient) {
            return NextResponse.json({ error: `Patient with ID ${id} not found` }, { status: 404 });
        }

        const note = patient.notes.id(noteId);
        if (!note) {
            return NextResponse.json({ error: `Note with ID ${noteId} not found` }, { status: 404 });
        }

        note.content = content;
        await patient.save();

        return NextResponse.json(note, { status: 200 });
    } catch (error) {
        console.error('Failed to update doctor note:', error);
        return NextResponse.json({ error: `Failed to update doctor note: ${error.message}` }, { status: 500 });
    }
}