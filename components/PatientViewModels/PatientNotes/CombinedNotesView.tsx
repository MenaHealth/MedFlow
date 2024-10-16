// components/PatientViewModels/PatientNotes/CombinedNotesView.tsx

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { CombinedNotesViewModel } from "./CombinedNotesViewModel";
import { PhysicianNoteView } from "./PhysicianNoteView";
import { ProcedureNoteView } from "./ProcedureNoteView";
import { SubjectiveNoteView } from "./SubjectiveNoteView";
import { PreviousNotesView } from "./PreviousNotesView";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioCard } from "@/components/ui/radio-card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from '@/components/form/ScrollArea';
import { ArrowDownWideNarrow } from 'lucide-react';

interface NotesViewProps {
    patientId: string;
}

export function CombinedNotesView({ patientId }: NotesViewProps) {
    const { data: session, status } = useSession();
    const userEmail = session?.user?.email || '';
    const [isExpanded, setIsExpanded] = useState(false);

    const {
        templateType,
        setTemplateType,
        physicianNote,
        procedureNote,
        subjectiveNote,
        createNote,
        setNoteField,
    } = CombinedNotesViewModel(patientId, userEmail);

    const handleCreateNote = async () => {
        try {
            await createNote();
            console.log('Note created successfully');
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };

    if (status === 'unauthenticated' || !session?.user) {
        return <div>Access Denied</div>;
    }

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 h-[100vh] bg-darkBlue overflow-hidden">
            {/* Previous Notes Section */}
            <Card className={`md:col-span-1 ${isExpanded ? 'h-[80vh]' : 'h-[20vh] md:h-full'} transition-all duration-300 overflow-hidden`}>
                <CardHeader className="px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center space-x-2 flex-grow">
                        <h3 className="text-lg font-semibold">Previous Notes</h3>
                        <Button onClick={() => setIsExpanded(!isExpanded)} variant="default" size="icon" className="md:hidden flex-shrink-0">
                            <ArrowDownWideNarrow className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="h-full p-0">
                    <ScrollArea className="h-full w-full">
                        <PreviousNotesView patientId={patientId} />
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Notes Form Section */}
            <Card className={`md:col-span-2 ${isExpanded ? 'hidden md:block' : 'block'} h-[80vh] md:h-full overflow-hidden`}>
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
                <CardContent className="h-full p-0">
                    <ScrollArea className="h-full w-full pb-16">
                        <div className="mt-4 p-4">
                            {templateType === 'physician' && (
                                <PhysicianNoteView
                                    note={physicianNote}
                                    onChange={(name, value) => setNoteField('physician', name, value)}
                                />
                            )}
                            {templateType === 'procedure' && (
                                <ProcedureNoteView
                                    note={procedureNote}
                                    onChange={(name, value) => setNoteField('procedure', name, value)}
                                />
                            )}
                            {templateType === 'subjective' && (
                                <SubjectiveNoteView
                                    note={subjectiveNote}
                                    onChange={(name, value) => setNoteField('subjective', name, value)}
                                />
                            )}
                            <Button
                                onClick={handleCreateNote}
                                variant="submit"
                                className="mt-4"
                            >
                                Create Note
                            </Button>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

export default CombinedNotesView;