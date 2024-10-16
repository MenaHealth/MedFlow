// components/PatientViewModels/PatientNotes/PreviousNotesViewModel.tsx
import { usePatientDashboard } from '@/components/PatientViewModels/PatientContext';
import { INote, ISubjectiveNote, IPhysicianNote, IProcedureNote } from '@/models/note';

function isSubjective(note: INote): note is ISubjectiveNote {
    return note.noteType === 'subjective';
}

function isPhysician(note: INote): note is IPhysicianNote {
    return note.noteType === 'physician';
}

function isProcedure(note: INote): note is IProcedureNote {
    return note.noteType === 'procedure';
}

export function usePreviousNotesViewModel() {
    const { notes, loadingNotes: loading, error } = usePatientDashboard();

    const processedNotes = notes.map(note => {
        let content;
        let backgroundColor = '';

        // Format date to show only the date (no time)
        const formattedDate = note.date ? new Date(note.date).toLocaleDateString() : 'Date Unavailable';

        // Determine content and background color based on note type
        if (isSubjective(note)) {
            content = note.subjective;
            backgroundColor = 'bg-orange-50';
        } else if (isPhysician(note)) {
            content = note.diagnosis;
            backgroundColor = 'bg-orange-100';
        } else if (isProcedure(note)) {
            content = note.procedureName;
            backgroundColor = 'bg-orange-200';
        } else {
            content = "No content available";
        }

        return {
            ...note,
            content,
            date: formattedDate, // Use formatted date
            backgroundColor,
        };
    });

    const handleDownload = (note: INote) => {
        const blob = new Blob([JSON.stringify(note)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `note-${note._id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return {
        notes: processedNotes,
        loading,
        error,
        handleDownload,
    };
}