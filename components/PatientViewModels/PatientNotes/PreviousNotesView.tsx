// components/PatientViewModels/PatientNotes/PreviousNotesView.tsx

import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Download } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import { usePreviousNotesViewModel } from './PreviousNotesViewModel';

export function PreviousNotesView() {
    const { notes, loading, error, handleDownload } = usePreviousNotesViewModel();

    if (loading) return <ClipLoader />;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Previous Notes</h2>
            {notes.length > 0 ? (
                <ul className="list-none p-0">
                    {notes.map((note) => (
                        <li key={note._id} className="p-4 border-b border-gray-200 last:border-b-0 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{note.title}</h3> {/* Displays note type */}
                                <p className="text-sm text-gray-500">
                                    {note.patientName} - {new Date(note.date).toLocaleString()}
                                </p>
                                <p>{note.content}</p> {/* Displays dynamically generated content */}
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