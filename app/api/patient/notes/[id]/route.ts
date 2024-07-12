// app/api/patient/notes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../utils/database.ts';
import Note from '../../../../../models/note';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const patientId = params.id;
        const notes = await Note.find({ patientId }).sort({ date: -1 });
        return NextResponse.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        return NextResponse.json({ message: 'Failed to fetch notes', error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const patientId = params.id;
        const { content, username } = await request.json();
        const newNote = new Note({
            content,
            username,
            patientId
        });
        await newNote.save();
        return NextResponse.json(newNote, { status: 201 });
    } catch (error) {
        console.error('Error adding note:', error);
        return NextResponse.json({ message: 'Failed to add note', error: error.message }, { status: 500 });
    }
}