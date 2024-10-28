// components/PatientViewModels/PatientNotes/PreviousNotesView.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronsDown, ChevronsUp, ChevronUp } from 'lucide-react'; // Importing the Chevron icons
import { usePreviousNotesViewModel } from './PreviousNotesViewModel';
import { ScrollArea } from './../../../../components/form/ScrollArea';

interface PreviousNotesViewProps {
    patientId: string;
}

export function PreviousNotesView({ patientId }: PreviousNotesViewProps) {

    const { notes, loading } = usePreviousNotesViewModel();
    const [expandedNotes, setExpandedNotes] = useState<string[]>([]);
    const [expandAll, setExpandAll] = useState(false);

    if (loading) return <p>Loading...</p>; // Render loading state

    // Toggles individual note expansion
    const toggleNoteExpansion = (noteId: string) => {
        if (expandedNotes.includes(noteId)) {
            setExpandedNotes(expandedNotes.filter(id => id !== noteId));
        } else {
            setExpandedNotes([...expandedNotes, noteId]);
        }
    };

    // Toggles expansion for all notes
    const toggleExpandAll = () => {
        if (expandAll) {
            setExpandedNotes([]); // Collapse all notes
        } else {
            setExpandedNotes(notes.map(note => note._id)); // Expand all notes
        }
        setExpandAll(!expandAll);
    };

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
            <div className="flex justify-between items-center px-4 py-2 bg-gray-100">
                {/*<h3 className="font-bold">Previous Notes</h3>*/}
                <button onClick={toggleExpandAll} className="text-gray-600">
                    {expandAll ? <ChevronsUp className="h-5 w-5" /> : <ChevronsDown className="h-5 w-5" />}
                </button>
            </div>
            <ScrollArea className="h-full w-full">
                {notes.length > 0 ? (
                    <ul className="list-none p-0">
                        {notes.map((note) => (
                            <li
                                key={note._id}
                                className={`p-4 border-b border-gray-100 last:border-b-0 transition-all duration-500 ease-out ${getBackgroundColor(note.noteType)}`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">
                                            {note.noteType || 'note type Unavailable'} {/* Display author name */}
                                        </h3>
                                        <p>
                                            {note.date ? new Date(note.date).toLocaleDateString() : 'Date Unavailable'}
                                        </p>
                                        <h3 className="font-bold">
                                            {note.authorName || 'Author Unavailable'} {/* Display author name */}
                                        </h3>
                                    </div>
                                    <button onClick={() => toggleNoteExpansion(note._id)} className="text-gray-600">
                                        {expandedNotes.includes(note._id) ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                    </button>
                                </div>

                                {/* Conditionally render full content if note is expanded */}
                                {expandedNotes.includes(note._id) && (
                                    <div className="mt-2">
                                        {note.noteType === 'triage' && note.content && (
                                            <>
                                                <p><strong>Subjective:</strong> {note.content.triageDetails}</p>
                                            </>
                                        )}
                                        {note.noteType === 'subjective' && note.content && (
                                            <>
                                                <p><strong>Subjective:</strong> {note.content.subjective}</p>
                                                <p><strong>Objective:</strong> {note.content.objective}</p>
                                                <p><strong>Assessment:</strong> {note.content.assessment}</p>
                                                <p><strong>Plan:</strong> {note.content.plan}</p>
                                            </>
                                        )}
                                        {note.noteType === 'physician' && note.content && (
                                            <>
                                                <p><strong>Diagnosis:</strong> {note.content.diagnosis}</p>
                                                <p><strong>MDM:</strong> {note.content.mdm}</p>
                                                <p><strong>Plan & Follow-Up:</strong> {note.content.planAndFollowUp}</p>
                                            </>
                                        )}
                                        {note.noteType === 'procedure' && note.content && (
                                            <>
                                                <p><strong>Procedure Name:</strong> {note.content.procedureName}</p>
                                                <p><strong>Diagnosis:</strong> {note.content.diagnosis}</p>
                                                <p><strong>Notes:</strong> {note.content.notes}</p>
                                                <p><strong>Plan:</strong> {note.content.plan}</p>
                                            </>
                                        )}
                                    </div>
                                )}
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