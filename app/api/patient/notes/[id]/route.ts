// app/api/patient/notes/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../utils/database';
import Patient from '../../../../../models/patient';
import { Note, PhysicianNote, ProcedureNote, SubjectiveNote } from '../../../../../models/note';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const patientId = params.id;
        const noteData = await request.json();

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
        }

        let newNote;

        switch (noteData.type) {
            case 'physician':
                newNote = new PhysicianNote({
                    ...noteData,
                    date: new Date(noteData.date), // Ensure date is properly parsed
                    email: noteData.email,
                    createdAt: new Date(noteData.createdAt)
                });
                break;
            case 'procedure':
                newNote = new ProcedureNote({
                    ...noteData,
                    email: noteData.email,
                    createdAt: new Date(noteData.createdAt)
                });
                break;
            case 'subjective':
                newNote = new SubjectiveNote({
                    ...noteData,
                    email: noteData.email,
                    createdAt: new Date(noteData.createdAt)
                });
                break;
            default:
                return NextResponse.json({ message: 'Invalid note type' }, { status: 400 });
        }

        await newNote.save();
        patient.notes.push(newNote);
        await patient.save();

        return NextResponse.json({ message: 'Note added successfully', note: newNote }, { status: 201 });
    } catch (error) {
        console.error('Error adding note:', error);
        return NextResponse.json({ message: 'Failed to add note', error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const noteId = searchParams.get('noteId');
        const patientId = params.id;

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
        }

        if (noteId) {
            const note = patient.notes.id(noteId);
            if (!note) {
                return NextResponse.json({ message: 'Note not found' }, { status: 404 });
            }
            return NextResponse.json(note);
        } else {
            return NextResponse.json(patient.notes.sort((a, b) => b.date - a.date)); // Sort notes by date descending
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
        return NextResponse.json({ message: 'Failed to fetch notes' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const noteId = searchParams.get('noteId');
        const patientId = params.id;

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
        }

        const note = patient.notes.id(noteId);
        if (!note) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }

        note.remove();
        await patient.save();

        return NextResponse.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        return NextResponse.json({ message: 'Failed to delete note' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';