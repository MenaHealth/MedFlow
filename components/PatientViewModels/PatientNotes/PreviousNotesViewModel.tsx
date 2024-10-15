// components/PatientViewModels/PatientNotes/PreviousNotesViewModel.tsx
import { usePatientDashboard } from '@/components/PatientViewModels/PatientContext';

export function usePreviousNotesViewModel() {
    const { notes, loadingNotes: loading, error } = usePatientDashboard();

    // Generate display content based on note type
    const processedNotes = notes.map(note => {
        let content;
        switch (note.noteType) {
            case 'subjective':
                content = note.subjective; // Use subjective content for subjective notes
                break;
            case 'procedure':
                content = note.procedureName; // Use procedure name for procedure notes
                break;
            case 'physician':
                content = note.diagnosis; // Use diagnosis for physician notes
                break;
            default:
                content = "No content available"; // Default message if no specific field is set
        }

        return {
            ...note,
            content, // Add content field specifically for the view
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
        loading,
        error,
        handleDownload
    };
}