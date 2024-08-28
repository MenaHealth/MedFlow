// app/api/patient/notes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../utils/database';
import Note from '../../../../../models/note';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const patientId = params.id;
        const notes = await Note.find({ patientId }).sort({ date: -1 });
        return NextResponse.json(notes);
    } catch (error: unknown) {
        console.error('Error fetching notes:', error);
        if (error instanceof Error) {
            return NextResponse.json({ message: 'Failed to fetch notes', error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'Failed to fetch notes', error: 'Unknown error' }, { status: 500 });
        }
    }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const patientId = params.id;
        const { content, username } = await request.json();
        const newNote = new Note({
            procedureName,
            date,
            physician,
            diagnosis,
            content,
            username,
            patientId
        });
        await newNote.save();
        return NextResponse.json(newNote, { status: 201 });
    } catch (error: unknown) {
        console.error('Error adding note:', error);
        if (error instanceof Error) {
            return NextResponse.json({ message: 'Failed to add note', error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'Failed to add note', error: 'Unknown error' }, { status: 500 });
        }
    }
}