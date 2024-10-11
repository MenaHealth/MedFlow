import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { SubjectiveNote } from './NotesViewModel';

interface SubjectiveNoteViewProps {
    note: SubjectiveNote;
    onChange: (name: string, value: string) => void;
}

export const SubjectiveNoteView: React.FC<SubjectiveNoteViewProps> = ({ note, onChange }) => {
    return (
        <div className="space-y-4">
            <Textarea
                name="subjective"
                placeholder="Subjective"
                value={note.subjective}
                onChange={(e) => onChange('subjective', e.target.value)}
            />
            <Textarea
                name="objective"
                placeholder="Objective"
                value={note.objective}
                onChange={(e) => onChange('objective', e.target.value)}
            />
            <Textarea
                name="assessment"
                placeholder="Assessment"
                value={note.assessment}
                onChange={(e) => onChange('assessment', e.target.value)}
            />
            <Textarea
                name="plan"
                placeholder="Plan"
                value={note.plan}
                onChange={(e) => onChange('plan', e.target.value)}
            />
        </div>
    );
};