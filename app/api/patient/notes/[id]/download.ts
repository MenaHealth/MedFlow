import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../utils/database';
import Note from '../../../../../models/note';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const noteId = params.id;
        const note = await Note.findById(noteId);

        if (!note) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }

        const noteContent = `
            Note ID: ${note._id}
            Content: ${note.content}
            Created by: ${note.username}
            Date: ${new Date(note.date).toLocaleString()}
        `;

        const response = new NextResponse(noteContent);
        response.headers.set('Content-Disposition', `attachment; filename=note-${noteId}.txt`);
        return response;

    } catch (error: unknown) {
        console.error('Error downloading note:', error);
        return NextResponse.json({ message: 'Failed to download note', error: 'Unknown error' }, { status: 500 });
    }
}
