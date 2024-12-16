import React from 'react';
import { TextFormField } from "../../../ui/TextFormField";
import { PhysicianNote } from '../CombinedNotesViewModel';
import {ScrollArea} from "../../../ui/ScrollArea";

interface PhysicianNoteViewProps {
    note: PhysicianNote;
    onChange: (name: string, value: string) => void;
}

export const PhysicianNoteView: React.FC<PhysicianNoteViewProps> = ({ note, onChange }) => {
    return (
        <div className="h-full">
                <ScrollArea className="h-full w-full">
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
                                <TextFormField
                                    fieldName="hpi"
                                    fieldLabel="History of Present Illness"
                                    value={note.hpi}
                                    onChange={(e) => onChange('hpi', e.target.value)}
                                    multiline
                                    rows={4}
                                />
                                <TextFormField
                                    fieldName="rosConstitutional"
                                    fieldLabel="ROS - Constitutional"
                                    value={note.rosConstitutional}
                                    onChange={(e) => onChange('rosConstitutional', e.target.value)}
                                    multiline
                                    rows={4}
                                />
                                <TextFormField
                                    fieldName="rosCardiovascular"
                                    fieldLabel="ROS - Cardiovascular"
                                    value={note.rosCardiovascular}
                                    onChange={(e) => onChange('rosCardiovascular', e.target.value)}
                                    multiline
                                    rows={4}
                                />
                                <TextFormField
                                    fieldName="rosRespiratory"
                                    fieldLabel="ROS - Respiratory"
                                    value={note.rosRespiratory}
                                    onChange={(e) => onChange('rosRespiratory', e.target.value)}
                                    multiline
                                    rows={4}
                                />
                                <TextFormField
                                    fieldName="rosGastrointestinal"
                                    fieldLabel="ROS - Gastrointestinal"
                                    value={note.rosGastrointestinal}
                                    onChange={(e) => onChange('rosGastrointestinal', e.target.value)}
                                    multiline
                                    rows={4}
                                />
                                <TextFormField
                                    fieldName="rosGenitourinary"
                                    fieldLabel="ROS - Genitourinary"
                                    value={note.rosGenitourinary}
                                    onChange={(e) => onChange('rosGenitourinary', e.target.value)}
                                    multiline
                                    rows={4}
                                />
                                <TextFormField
                                    fieldName="rosMusculoskeletal"
                                    fieldLabel="ROS - Musculoskeletal"
                                    value={note.rosMusculoskeletal}
                                    onChange={(e) => onChange('rosMusculoskeletal', e.target.value)}
                                    multiline
                                    rows={4}
                                />
                                <TextFormField
                                    fieldName="rosNeurological"
                                    fieldLabel="ROS - Neurological"
                                    value={note.rosNeurological}
                                    onChange={(e) => onChange('rosNeurological', e.target.value)}
                                    multiline
                                    rows={4}
                                />
                                <TextFormField
                                    fieldName="rosPsychiatric"
                                    fieldLabel="ROS - Psychiatric"
                                    value={note.rosPsychiatric}
                                    onChange={(e) => onChange('rosPsychiatric', e.target.value)}
                                    multiline
                                    rows={4}
                                />
                                <TextFormField
                                    fieldName="mdm"
                                    fieldLabel="Medical Decision Making"
                                    value={note.mdm}
                                    onChange={(e) => onChange('mdm', e.target.value)}
                                    multiline
                                    rows={4}
                                />
                                <TextFormField
                                    fieldName="planAndFollowUp"
                                    fieldLabel="Plan and Follow-up"
                                    value={note.planAndFollowUp}
                                    onChange={(e) => onChange('planAndFollowUp', e.target.value)}
                                    multiline
                                    rows={4}
                                />
                                <TextFormField
                                    fieldName="diagnosis"
                                    fieldLabel="Diagnosis"
                                    value={note.diagnosis}
                                    onChange={(e) => onChange('diagnosis', e.target.value)}
                                    multiline
                                    rows={4}
                                />
                                <TextFormField
                                    fieldName="signature"
                                    fieldLabel="Signature"
                                    value={note.signature}
                                    onChange={(e) => onChange('signature', e.target.value)}
                                />
                        </div>
                </ScrollArea>
        </div>
        );
};