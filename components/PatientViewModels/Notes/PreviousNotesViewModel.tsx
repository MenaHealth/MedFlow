// components/PatientViewModels/Notes/PreviousNotesViewModel.tsx
import { useState, useCallback, useEffect } from 'react';

interface Note {
    _id: string;
    title: string;
    email: string;
    date: string;
    content: string;
}

export function usePreviousNotes(patientId: string) {
    const [notesList, setNotesList] = useState<Note[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchNotes = useCallback(async () => {
        try {
            const response = await fetch(`/api/patient/notes/${patientId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const notes = await response.json();
            setNotesList(notes);
        } catch (error) {
            console.error('Failed to fetch notes:', error);
            setError(error.message);
        }
    }, [patientId]);

    const deleteNote = useCallback(async (noteId: string) => {
        try {
            const response = await fetch(`/api/patient/notes/${patientId}?noteId=${noteId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setNotesList((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
        } catch (error) {
            console.error('Failed to delete note:', error);
            setError(error.message);
        }
    }, [patientId]);

    useEffect(() => {
        if (patientId) {
            fetchNotes();
        }
    }, [patientId, fetchNotes]);

    return {
        notesList,
        error,
        fetchNotes,
        deleteNote,
    };
}