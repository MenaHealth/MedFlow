// components/PatientViewModels/Notes/PreviousNotesView.tsx
import React from 'react';
import { usePreviousNotes } from './PreviousNotesViewModel';
import { NotesList } from '@/components/PatientViewModels/Notes/NotesList';

interface PreviousNotesViewProps {
    patientId: string;
}

const PreviousNotesView: React.FC<PreviousNotesViewProps> = ({ patientId }) => {
    const { notesList, error, deleteNote } = usePreviousNotes(patientId);

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h2>Previous Notes</h2>
            {notesList.length > 0 ? (
                <NotesList notes={notesList} onDelete={deleteNote} />
            ) : (
                <p>No previous notes found for this patient.</p>
            )}
        </div>
    );
};

export default PreviousNotesView;