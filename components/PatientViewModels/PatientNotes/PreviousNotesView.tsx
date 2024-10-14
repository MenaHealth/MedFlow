// components/PatientViewModels/PatientNotes/PreviousNotesView.tsx

import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Download } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import { usePatientDashboard } from '@/components/PatientViewModels/PatientContext';

export function PreviousNotesView() {
    const { notes, loadingNotes: loading, error } = usePatientDashboard();

    const handleDownload = (note: Note) => {
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

    if (loading) {
        return <ClipLoader />;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h2>Previous Notes</h2>
            {notes.length > 0 ? (
                <ul className="list-none p-0">
                    {notes.map((note) => (
                        <li key={note._id} className="p-4 border-b border-gray-200 last:border-b-0 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{note.title}</h3>
                                <p className="text-sm text-gray-500">{note.email} - {new Date(note.date).toLocaleString()}</p>
                                <p>{note.content}</p>
                            </div>
                            <div>
                                <Button onClick={() => handleDownload(note)} size="icon" variant="ghost">
                                    <Download className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No previous notes found for this patient.</p>
            )}
        </div>
    );
}