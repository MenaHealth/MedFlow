import React from 'react';
import { ProcedureNote } from '../CombinedNotesViewModel';
import {TextFormField} from "./../../../../components/ui/TextFormField";
import {ScrollArea} from "../../../ui/ScrollArea";

interface ProcedureNoteViewProps {
    note: ProcedureNote;
    onChange: (name: string, value: string) => void;
}

export const ProcedureNoteView: React.FC<ProcedureNoteViewProps> = ({ note, onChange }) => {
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
                fieldName="attendingPhysician"
                fieldLabel="Attending Physician"
                value={note.attendingPhysician}
                onChange={(e) => onChange('attendingPhysician', e.target.value)}
            />
            <TextFormField
                fieldName="procedureName"
                fieldLabel="Procedure Name"
                value={note.procedureName}
                onChange={(e) => onChange('procedureName', e.target.value)}
            />
            <TextFormField
                fieldName="diagnosis"
                fieldLabel="Diagnosis"
                value={note.diagnosis} // Changed from Diagnosis
                onChange={(e) => onChange('diagnosis', e.target.value)}
            />
            <TextFormField
                fieldName="notes"
                fieldLabel="Notes"
                value={note.notes} // Changed from Notes
                onChange={(e) => onChange('notes', e.target.value)}
            />
            <TextFormField
                fieldName="plan"
                fieldLabel="Plan"
                value={note.plan} // Changed from Plan
                onChange={(e) => onChange('plan', e.target.value)}
            />
            </ScrollArea>
        </div>
    );
};