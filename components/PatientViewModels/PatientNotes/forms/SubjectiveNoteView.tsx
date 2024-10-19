import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { SubjectiveNote } from '../CombinedNotesViewModel';
import {TextFormField} from "@/components/ui/TextFormField";
import {ScrollArea} from "@/components/form/ScrollArea";

interface SubjectiveNoteViewProps {
    note: SubjectiveNote;
    onChange: (name: string, value: string) => void;
}

export const SubjectiveNoteView: React.FC<SubjectiveNoteViewProps> = ({ note, onChange }) => {
    return (
        <div className="space-y-4">
            <ScrollArea className="h-full w-full">
            <TextFormField
                fieldName="date"
                fieldLabel="Date"
                value={note.date}
                onChange={(e) => onChange('date', e.target.value)}
                type="date"
            />
            <TextFormField
                fieldName="time"
                fieldLabel="Time"
                value={note.time}
                onChange={(e) => onChange('time', e.target.value)}
                type="time"
            />
            <TextFormField
                fieldName="subjective"
                fieldLabel="Subjective"
                value={note.subjective}
                onChange={(e) => onChange('subjective', e.target.value)}
            />
            <TextFormField
                fieldName="objective"
                fieldLabel="Objective"
                value={note.objective}
                onChange={(e) => onChange('objective', e.target.value)}
            />
            <TextFormField
                fieldName="assessment"
                fieldLabel="Assessment"
                value={note.assessment}
                onChange={(e) => onChange('assessment', e.target.value)}
            />
            <TextFormField
                fieldName="plan"
                fieldLabel="Plan"
                value={note.plan}
                onChange={(e) => onChange('plan', e.target.value)}
            />
            </ScrollArea>
        </div>
    );
};