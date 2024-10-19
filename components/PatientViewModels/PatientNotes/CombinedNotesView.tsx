import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CombinedNotesViewModel } from "./CombinedNotesViewModel";
import { PhysicianNoteView } from "./forms/PhysicianNoteView";
import { ProcedureNoteView } from "./forms/ProcedureNoteView";
import { SubjectiveNoteView } from "./forms/SubjectiveNoteView";
import { PreviousNotesView } from "./previous/PreviousNotesView";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { RadioCard } from "../../ui/radio-card";
import { Button } from "../../ui/button";
import { ScrollArea } from '../../form/ScrollArea';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ReadOnlyField from "../../form/ReadOnlyField";
import { Resizable } from './../../ui/Resizable';

interface NotesViewProps {
    patientId: string;
}

export function CombinedNotesView({ patientId }: NotesViewProps) {
    const { data: session, status } = useSession();
    const [isExpanded, setIsExpanded] = useState(false);
    const [previousNotesWidth, setPreviousNotesWidth] = useState(400);

    const {
        templateType,
        setTemplateType,
        physicianNote,
        procedureNote,
        subjectiveNote,
        createNote,
        setNoteField,
        isLoading
    } = CombinedNotesViewModel(patientId);

    useEffect(() => {
        console.log('CombinedNotesView mounted');
        return () => {
            console.log('CombinedNotesView unmounted');
        };
    }, []);

    const handleCreateNote = async () => {
        console.log('Create Note button clicked');
        console.log('Session status:', status);

        if (status === "authenticated") {
            try {
                await createNote();
                console.log('Note created successfully');
            } catch (error) {
                console.error('Error creating note:', error);
            }
        } else {
            console.error('Session not authenticated');
        }
    };

    const handleResize = (width: number) => {
        setPreviousNotesWidth(width);
    };

    if (status === 'unauthenticated' || !session?.user) {
        return <div>Access Denied</div>;
    }

    return (
        <div className="flex flex-col md:flex-row h-[100vh] bg-darkBlue overflow-hidden">
            {/* Previous Notes Section */}
            <Resizable
                className="hidden md:block"
                minWidth={200}
                maxWidth={800}
                defaultWidth={400}
                onResize={handleResize}
            >
                <Card className="h-full">
                    <ScrollArea className="h-full w-full">
                        <CardHeader className="px-4 py-2">
                            <h3 className="text-lg font-semibold">Previous Notes</h3>
                        </CardHeader>
                        <CardContent className="h-full p-0">
                            <PreviousNotesView patientId={patientId} />
                        </CardContent>
                    </ScrollArea>
                </Card>
            </Resizable>

            {/* Mobile Previous Notes Section */}
            <Card className="md:hidden w-full">
                <CardHeader
                    className="px-4 py-2 flex justify-between items-center cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <h3 className="text-lg font-semibold">Previous Notes</h3>
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CardHeader>
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[50vh]' : 'max-h-0'}`}>
                    <ScrollArea className="h-[50vh] w-full">
                        <PreviousNotesView patientId={patientId} />
                    </ScrollArea>
                </div>
            </Card>

            {/* Notes Form Section */}
            <Card className="flex-grow h-full md:h-auto overflow-hidden">
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
                <CardContent className="h-full md:h-[calc(100vh-120px)] p-0">
                    <ScrollArea className="h-full w-full pb-16">
                        <div className="mt-4 p-4">
                            {templateType === 'physician' && (
                                isLoading ? (
                                    <ReadOnlyField fieldName="physician" fieldLabel="Physician Note" value={JSON.stringify(physicianNote)} />
                                ) : (
                                    <PhysicianNoteView
                                        note={physicianNote}
                                        onChange={(name, value) => setNoteField('physician', name, value)}
                                    />
                                )
                            )}
                            {templateType === 'procedure' && (
                                isLoading ? (
                                    <ReadOnlyField fieldName="procedure" fieldLabel="Procedure Note" value={JSON.stringify(procedureNote)} />
                                ) : (
                                    <ProcedureNoteView
                                        note={procedureNote}
                                        onChange={(name, value) => setNoteField('procedure', name, value)}
                                    />
                                )
                            )}
                            {templateType === 'subjective' && (
                                isLoading ? (
                                    <ReadOnlyField fieldName="subjective" fieldLabel="Subjective Note" value={JSON.stringify(subjectiveNote)} />
                                ) : (
                                    <SubjectiveNoteView
                                        note={subjectiveNote}
                                        onChange={(name, value) => setNoteField('subjective', name, value)}
                                    />
                                )
                            )}
                            <Button
                                onClick={handleCreateNote}
                                variant="submit"
                                className="mt-4"
                                disabled={status !== "authenticated" || isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Create Note'}
                            </Button>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

export default CombinedNotesView;