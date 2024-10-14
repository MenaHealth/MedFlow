// components/PatientViewModels/PatientNotes/PreviousNotesViewModel.tsx
import { useState, useEffect } from 'react';

export interface Note {
    _id: string;
    title: string;
    email: string;
    date: string;
    content: string;
}

export class PreviousNotesViewModel {
    private patientId: string;
    private notes: Note[] = [];
    private loading: boolean = true;
    private error: string | null = null;

    constructor(patientId: string) {
        this.patientId = patientId;
    }

    async fetchNotes() {
        this.loading = true;
        this.error = null;
        try {
            const response = await fetch(`/api/patient/notes/${this.patientId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.notes = await response.json();
        } catch (error) {
            console.error('Failed to fetch notes:', error);
            this.error = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }

    getNotes() {
        return this.notes;
    }

    isLoading() {
        return this.loading;
    }

    getError() {
        return this.error;
    }

    handleDownload(note: Note) {
        const blob = new Blob([JSON.stringify(note)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `note-${note._id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

export function usePreviousNotesViewModel(patientId: string) {
    const [viewModel] = useState(() => new PreviousNotesViewModel(patientId));
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadNotes() {
            await viewModel.fetchNotes();
            setNotes(viewModel.getNotes());
            setLoading(viewModel.isLoading());
            setError(viewModel.getError());
        }
        loadNotes();
    }, [viewModel]);

    return {
        notes,
        loading,
        error,
        handleDownload: viewModel.handleDownload
    };
}

export default function Component() {
    return null;
}