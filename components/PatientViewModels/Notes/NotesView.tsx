import React, { useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { NotesViewModel, PhysicianNote, ProcedureNote, SubjectiveNote } from "@/components/PatientViewModels/Notes/NotesViewModel";
import { PhysicianNoteView } from "@/components/PatientViewModels/Notes/PhysicianNoteView";
import { ProcedureNoteView } from "@/components/PatientViewModels/Notes/ProcedureNoteView";
import { SubjectiveNoteView } from "@/components/PatientViewModels/Notes/SubjectiveNoteView";
import PreviousNotesView from "@/components/PatientViewModels/Notes/PreviousNotesView";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioCard } from "@/components/ui/radio-card";
import { Button } from "@/components/ui/button";

interface NotesViewProps {
    patientId: string;
}

export const NotesView: React.FC<NotesViewProps> = ({ patientId }) => {
    const { data: session, status } = useSession();
    const userEmail = session?.user?.email || '';
    const userName = session?.user ? `Dr. ${session.user.firstName} ${session.user.lastName}` : '';

    const {
        templateType,
        setTemplateType,
        physicianNote,
        procedureNote,
        subjectiveNote,
        fetchNotes,
        publishNote,
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
            const allFieldsFilled = Object.values(obj).every(value =>
                value !== '' && value !== null && value !== undefined
            );

            console.log("Checking fields for:", obj);
            console.log("All fields filled:", allFieldsFilled);

            return allFieldsFilled;
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
                console.log("Invalid templateType:", templateType);
                return false;
        }

        const isValid = checkAllFieldsFilled(currentNote);
        console.log("isFormValid for template type", templateType, ":", isValid);

        return isValid;
    }, [templateType, physicianNote, procedureNote, subjectiveNote]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated' || !session?.user) {
        return <div>Access Denied</div>;
    }

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 bg-darkBlue">
            <Card className="md:col-span-1">
                <CardHeader className="px-4 py-2">
                    <h3 className="text-lg font-semibold">Previous Notes</h3>
                </CardHeader>
                <CardContent>
                    <PreviousNotesView patientId={patientId} />
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader className="px-4 py-2">
                    <RadioCard.Root
                        defaultValue="physician"
                        onValueChange={(value) => setTemplateType(value as "physician" | "procedure" | "subjective")}
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
                            {console.log("Button disabled:", !isFormValid)}
                            Publish Note
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};