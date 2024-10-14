// components/PatientViewModels/PatientNotes/CombinedNotesView.tsx

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CombinedNotesViewModel } from "./CombinedNotesViewModel";
import { PhysicianNoteView } from "./PhysicianNoteView";
import { ProcedureNoteView } from "./ProcedureNoteView";
import { SubjectiveNoteView } from "./SubjectiveNoteView";
import { PreviousNotesView } from "./PreviousNotesView";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioCard } from "@/components/ui/radio-card";
import { Button } from "@/components/ui/button";

interface NotesViewProps {
    patientId: string;
}

export function CombinedNotesView({ patientId }: NotesViewProps) {
    const { data: session, status } = useSession();
    const userEmail = session?.user?.email || '';

    const {
        templateType,
        setTemplateType,
        physicianNote,
        procedureNote,
        subjectiveNote,
        publishNote,
        updateNote,
    } = CombinedNotesViewModel(patientId, userEmail);

    const handlePublishNote = async () => {
        try {
            await publishNote();
            console.log('Note published successfully');
            // You might want to add some UI feedback here
        } catch (error) {
            console.error('Error publishing note:', error);
            // You might want to add some error handling UI here
        }
    };

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
                            onClick={handlePublishNote}
                            variant="submit"
                            className="mt-4"
                        >
                            Publish Note
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default CombinedNotesView;