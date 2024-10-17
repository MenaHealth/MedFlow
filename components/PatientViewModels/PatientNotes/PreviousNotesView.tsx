// components/PatientViewModels/PatientNotes/PreviousNotesView.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Download } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import { usePreviousNotesViewModel } from './PreviousNotesViewModel';
import { ScrollArea } from '@/components/form/ScrollArea';

export function PreviousNotesView() {
    const { notes, loading, error, handleDownload } = usePreviousNotesViewModel();
    const [newNoteIds, setNewNoteIds] = useState<string[]>([]);

    if (loading) return <ClipLoader />; // Render ClipLoader while loading
    if (error) return <p>Error: {error}</p>;

    const getBackgroundColor = (noteType: string) => {
        switch (noteType) {
            case 'subjective':
                return 'bg-orange-50';
            case 'physician':
                return 'bg-orange-100';
            case 'procedure':
                return 'bg-orange-200';
            default:
                return 'bg-white';
        }
    };

    return (
        <div className="h-full">
            <ScrollArea className="h-full w-full">
                {notes.length > 0 ? (
                    <ul className="list-none p-0">
                        {notes.map((note) => (
                            <li
                                key={note._id}
                                className={`p-4 border-b border-gray-200 last:border-b-0 flex justify-between items-center transition-all duration-500 ease-out ${getBackgroundColor(note.noteType)}`}
                            >
                                <div>
                                    <h3 className="font-bold">{note.date ? new Date(note.date).toLocaleDateString() : 'Date Unavailable'}</h3>
                                    <h3 className="font-bold">{note.email} </h3>

                                    {/* Conditional content rendering based on note type */}
                                    {note.noteType === 'subjective' && <p>{note.subjective}</p>}
                                    {note.noteType === 'physician' && <p>{note.diagnosis}</p>}
                                    {note.noteType === 'procedure' && <p>{note.procedureName}</p>}

                                </div>
                                <div className="flex space-x-2">
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
            </ScrollArea>
        </div>
    );
}