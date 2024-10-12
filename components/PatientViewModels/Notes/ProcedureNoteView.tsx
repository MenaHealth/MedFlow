import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProcedureNote } from './NotesViewModel';
import {TextFormField} from "@/components/ui/TextFormField";

interface ProcedureNoteViewProps {
    note: ProcedureNote;
    onChange: (name: string, value: string) => void;
}

export const ProcedureNoteView: React.FC<ProcedureNoteViewProps> = ({ note, onChange }) => {
    return (
        <div className="space-y-4">
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
                fieldName="attendingPhysician"
                fieldLabel="Attending Physician"
                value={note.attendingPhysician}
                onChange={(e) => onChange('attendingPhysician', e.target.value)}
            />
            <Input
                name="procedureName"
                placeholder="Procedure Name"
                value={note.procedureName}
                onChange={(e) => onChange('procedureName', e.target.value)}
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