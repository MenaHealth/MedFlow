import React, { useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { NotesViewModel, PhysicianNote, ProcedureNote, SubjectiveNote } from "@/components/PatientViewModels/Notes/NotesViewModel";
import { PhysicianNoteView } from "@/components/PatientViewModels/Notes/PhysicianNoteView";
import { ProcedureNoteView } from "@/components/PatientViewModels/Notes/ProcedureNoteView";
import { SubjectiveNoteView } from "@/components/PatientViewModels/Notes/SubjectiveNoteView";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioCard } from "@/components/ui/radio-card";
import { Button } from "@/components/ui/button";
import { List } from "@/components/ui/List";
import { ListItem } from "@/components/ui/ListItem";
import { Trash2, Download } from 'lucide-react';

interface NotesViewProps {
    patientId: string;
}

export const NotesView: React.FC<NotesViewProps> = ({ patientId }) => {
    const { data: session, status } = useSession();
    const userEmail = session?.user?.email || '';
    const userName = session?.user ? `Dr. ${session.user.firstName} ${session.user.lastName}` : '';

    const {
        notesList,
        templateType,
        setTemplateType,
        physicianNote,
        procedureNote,
        subjectiveNote,
        fetchNotes,
        publishNote,
        deleteNote,
        updateNote,
    } = NotesViewModel(patientId, userEmail);

    useEffect(() => {
        if (status === 'authenticated' && patientId) {
            fetchNotes();
        }
    }, [status, fetchNotes, patientId]);

    useEffect(() => {
        if (userName) {
            updateNote('physician', 'attendingPhysician', userName);
            updateNote('procedure', 'attendingPhysician', userName);
        }
    }, [userName, updateNote]);

    const isFormValid = useMemo(() => {
        const checkAllFieldsFilled = (obj: Record<string, any>) => {
            return Object.values(obj).every(value =>
                value !== '' && value !== null && value !== undefined
            );
        };

        let currentNote: PhysicianNote | ProcedureNote | SubjectiveNote;
        switch (templateType) {
            case 'physician':
                currentNote = physicianNote;
                break;
            case 'procedure':
                currentNote = procedureNote;
                break;
            case 'subjective':
                currentNote = subjectiveNote;
                break;
            default:
                return false;
        }

        return checkAllFieldsFilled(currentNote);
    }, [templateType, physicianNote, procedureNote, subjectiveNote]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated' || !session?.user) {
        return <div>Access Denied</div>;
    }

    const handleDownload = (note: { _id: string; content: string }) => {
        const blob = new Blob([note.content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `note-${note._id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 bg-darkBlue">
            <Card className="md:col-span-1">
                <CardHeader className="px-4 py-2">
                    <h3 className="text-lg font-semibold">Previous Notes</h3>
                </CardHeader>
                <CardContent>
                    <List>
                        {notesList.map((note) => (
                            <ListItem key={note._id} className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold">{note.title}</h4>
                                    <p className="text-sm text-gray-500">{note.email} - {new Date(note.date).toLocaleString()}</p>
                                </div>
                                <div>
                                    <Button onClick={() => handleDownload(note)} size="icon" variant="ghost">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    <Button onClick={() => deleteNote(note._id)} size="icon" variant="ghost">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader className="px-4 py-2">
                    <RadioCard.Root
                        defaultValue="physician"
                        onValueChange={setTemplateType}
                        className="flex w-full"
                    >
                        <RadioCard.Item
                            value="physician"
                            className={`flex-1 ${templateType === 'physician' ? 'border-2 border-orange-500' : 'border border-gray-200'}`}
                        >
                            Physician
                        </RadioCard.Item>
                        <RadioCard.Item
                            value="procedure"
                            className={`flex-1 ${templateType === 'procedure' ? 'border-2 border-orange-500' : 'border border-gray-200'}`}
                        >
                            Procedure
                        </RadioCard.Item>
                        <RadioCard.Item
                            value="subjective"
                            className={`flex-1 ${templateType === 'subjective' ? 'border-2 border-orange-500' : 'border border-gray-200'}`}
                        >
                            Subjective
                        </RadioCard.Item>
                    </RadioCard.Root>
                </CardHeader>
                <CardContent>
                    <div className="mt-4">
                        {templateType === 'physician' && (
                            <PhysicianNoteView
                                note={physicianNote}
                                onChange={(name, value) => updateNote('physician', name, value)}
                            />
                        )}
                        {templateType === 'procedure' && (
                            <ProcedureNoteView
                                note={procedureNote}
                                onChange={(name, value) => updateNote('procedure', name, value)}
                            />
                        )}
                        {templateType === 'subjective' && (
                            <SubjectiveNoteView
                                note={subjectiveNote}
                                onChange={(name, value) => updateNote('subjective', name, value)}
                            />
                        )}
                        <Button
                            onClick={publishNote}
                            variant="submit"
                            className="mt-4"
                            disabled={!isFormValid}
                        >
                            Publish Note
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};