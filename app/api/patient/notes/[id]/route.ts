// app/api/patient/notes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../utils/database';
import Note from '../../../../../models/note';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const noteId = searchParams.get('noteId');

        if (noteId) {
            const note = await Note.findById(noteId);
            if (!note) {
                return NextResponse.json({ message: 'Note not found' }, { status: 404 });
            }
            return NextResponse.json(note);
        } else {
            const patientId = params.id;
            const notes = await Note.find({ patientId }).sort({ date: -1 });
            return NextResponse.json(notes);
        }
    } catch (error: unknown) {
        console.error('Error fetching notes:', error);
        return NextResponse.json({ message: 'Failed to fetch notes' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const patientId = params.id;
        const { content, username, title } = await request.json();

        console.log('Received data:', { content, username, title });

        const newNote = new Note({
            content,
            username,
            patientId,
            title,
            date: new Date(),
        });

        await newNote.save();
        console.log('Note saved:', newNote);

        return NextResponse.json(newNote, { status: 201 });
    } catch (error: unknown) {
        console.error('Error adding note:', error);
        return NextResponse.json({ message: 'Failed to add note' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const noteId = params.id;
        console.log(`Attempting to delete note with ID: ${noteId}`); // Debugging
        const deletedNote = await Note.findByIdAndDelete(noteId);

        if (!deletedNote) {
            console.log(`Note with ID: ${noteId} not found`);
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }

        console.log(`Note with ID: ${noteId} deleted successfully`);
        return NextResponse.json({ message: 'Note deleted successfully' });
    } catch (error: unknown) {
        console.error('Error deleting note:', error);
        return NextResponse.json({ message: 'Failed to delete note' }, { status: 500 });
    }
}
