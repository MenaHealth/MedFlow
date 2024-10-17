    // app/api/patient/notes2/[id]/route.ts

    import { NextRequest, NextResponse } from 'next/server';
    import dbConnect from '../../../../../utils/database';
    import Patient from '../../../../../models/patient';
    import { Note, PhysicianNote, ProcedureNote, SubjectiveNote } from '../../../../../models/note';

    export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
        await dbConnect();
        try {
            const patientId = params.id;
            const noteData = await request.json();

            // Find the patient by ID
            const patient = await Patient.findById(patientId);
            if (!patient) {
                return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
            }

            // Determine the note type and create the appropriate note
            let newNote;
            switch (noteData.noteType) {  // Changed from noteData.type to noteData.noteType
                case 'physician':
                    newNote = new PhysicianNote({
                        ...noteData,
                        date: new Date(noteData.date),
                        email: noteData.email,
                        createdAt: new Date(noteData.createdAt)
                    });
                    break;
                case 'procedure':
                    newNote = new ProcedureNote({
                        ...noteData,
                        date: new Date(noteData.date),
                        email: noteData.email,
                        createdAt: new Date(noteData.createdAt)
                    });
                    break;
                case 'subjective':
                    newNote = new SubjectiveNote({
                        ...noteData,
                        date: new Date(noteData.date),
                        email: noteData.email,
                        createdAt: new Date(noteData.createdAt)
                    });
                    break;
                default:
                    return NextResponse.json({ message: 'Invalid note type' }, { status: 400 });
            }

            // Save the new note and add it to the patient's notes2 array
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
            const patientId = params.id;
            const patient = await Patient.findById(patientId);

            if (!patient) {
                return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
            }

            const sortedNotes = patient.notes
                .map((note) => ({
                    _id: note._id.toString(),
                    title: note.noteType || 'Note',
                    email: note.email,
                    date: new Date(note.date).toISOString(),  // Ensure date is in ISO format
                    content: getContentForNoteType(note),
                }))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            return NextResponse.json(sortedNotes);
        } catch (error) {
            console.error('Error fetching notes2:', error);
            return NextResponse.json({ message: 'Failed to fetch notes2', error: error.message }, { status: 500 });
        }
    }

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

            const noteIndex = patient.notes.findIndex((note) => note._id.toString() === noteId);
            if (noteIndex === -1) {
                return NextResponse.json({ message: 'Note not found' }, { status: 404 });
            }

            patient.notes.splice(noteIndex, 1);
            await patient.save();

            return NextResponse.json({ message: 'Note deleted successfully' });
        } catch (error) {
            console.error('Error deleting note:', error);
            return NextResponse.json({ message: 'Failed to delete note', error: error.message }, { status: 500 });
        }
    }

export const dynamic = 'force-dynamic';