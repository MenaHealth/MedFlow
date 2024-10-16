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

    return (
        <div className="h-full">
            <ScrollArea className="h-full w-full">
                {notes.length > 0 ? (
                    <ul className="list-none p-0">
                        {notes.map((note) => (
                            <li
                                key={note._id}
                                className={`p-4 border-b border-gray-200 last:border-b-0 flex justify-between items-center transition-all duration-500 ease-out ${note.backgroundColor}`}
                            >
                                <div>
                                    <h3 className="font-bold">{note.date}</h3>
                                    <p>{note.content}</p>
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