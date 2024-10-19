// components/PatientViewModels/PatientNotes/PreviousNotesViewModel.tsx
import { usePatientDashboard } from '../../PatientViewModelContext';
import { INote } from './../../../../models/note';

export function usePreviousNotesViewModel() {
    const { notes, loadingNotes: loading, error } = usePatientDashboard();

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
        notes,
        loading,
        error,
        handleDownload,
    };
}