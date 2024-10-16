// components/PatientViewModels/PatientNotes/PreviousNotesViewModel.tsx
import { usePatientDashboard } from '@/components/PatientViewModels/PatientContext';

export function usePreviousNotesViewModel() {
    const { notes, loadingNotes: loading, error } = usePatientDashboard();

    const processedNotes = notes.map(note => {
        let content;
        switch (note.noteType) {
            case 'subjective':
                content = note.subjective;
                break;
            case 'procedure':
                content = note.procedureName;
                break;
            case 'physician':
                content = note.diagnosis;
                break;
            default:
                content = "No content available";
        }

        return {
            ...note,
            content,
        };
    });

    const handleDownload = (note) => {
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
        loading,  // Updated to use loadingNotes state from context
        error,
        handleDownload,
    };
}