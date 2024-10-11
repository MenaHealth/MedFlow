import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProcedureNote } from './NotesViewModel';

interface ProcedureNoteViewProps {
    note: ProcedureNote;
    onChange: (name: string, value: string) => void;
}

export const ProcedureNoteView: React.FC<ProcedureNoteViewProps> = ({ note, onChange }) => {
    return (
        <div className="space-y-4">
            <Input
                name="procedureName"
                placeholder="Procedure Name"
                value={note.procedureName}
                onChange={(e) => onChange('procedureName', e.target.value)}
            />
            <Input
                name="date"
                placeholder="Date"
                value={note.date}
                onChange={(e) => onChange('date', e.target.value)}
            />
            <Input
                name="physician"
                placeholder="Physician"
                value={note.physician}
                onChange={(e) => onChange('physician', e.target.value)}
            />
            <Input
                name="Diagnosis"
                placeholder="Diagnosis"
                value={note.Diagnosis}
                onChange={(e) => onChange('Diagnosis', e.target.value)}
            />
            <Textarea
                name="Notes"
                placeholder="Notes"
                value={note.Notes}
                onChange={(e) => onChange('Notes', e.target.value)}
            />
            <Textarea
                name="Plan"
                placeholder="Plan"
                value={note.Plan}
                onChange={(e) => onChange('Plan', e.target.value)}
            />
        </div>
    );
};