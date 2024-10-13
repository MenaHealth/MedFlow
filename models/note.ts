import mongoose, { Schema, Document, Model } from 'mongoose';

const noteSchema = new Schema<INote>({
    email: { type: String, required: true },
    type: { type: String, enum: ['physician', 'procedure', 'subjective', 'triage'], required: true },
    date: { type: Date, default: Date.now }
});


interface INote extends Document {
    email: string;
    type: 'physician' | 'procedure' | 'subjective' | 'triage';
    date: Date;
}

interface IPhysicianNote extends INote {
    attendingPhysician: string;
    hpi: string;
    rosConstitutional: string;
    rosCardiovascular: string;
    rosRespiratory: string;
    rosGastrointestinal: string;
    rosGenitourinary: string;
    rosMusculoskeletal: string;
    rosNeurological: string;
    rosPsychiatric: string;
    mdm: string;
    planAndFollowUp: string;
    diagnosis: string;
    signature: string;
}

interface IProcedureNote extends INote {
    procedureName: string;
    procedureDetails: string;
}

interface ISubjectiveNote extends INote {
    subjectiveComplaints: string;
}

interface ITriageNote extends INote {
    triageDetails: string;
    vitalSigns: {
        temperature: number;
        bloodPressure: string;
        heartRate: number;
        respiratoryRate: number;
    };
}

const physicianNoteSchema = new Schema<IPhysicianNote>({
    attendingPhysician: { type: String, required: true },
    hpi: { type: String, required: true },
    rosConstitutional: { type: String, required: true },
    rosCardiovascular: { type: String, required: true },
    rosRespiratory: { type: String, required: true },
    rosGastrointestinal: { type: String, required: true },
    rosGenitourinary: { type: String, required: true },
    rosMusculoskeletal: { type: String, required: true },
    rosNeurological: { type: String, required: true },
    rosPsychiatric: { type: String, required: true },
    mdm: { type: String, required: true },
    planAndFollowUp: { type: String, required: true },
    diagnosis: { type: String, required: true },
    signature: { type: String, required: true }
});

const procedureNoteSchema = new Schema<IProcedureNote>({
    procedureName: { type: String, required: true },
    procedureDetails: { type: String, required: true }
});

const subjectiveNoteSchema = new Schema<ISubjectiveNote>({
    subjectiveComplaints: { type: String, required: true }
});

const triageNoteSchema = new Schema<ITriageNote>({
    triageDetails: { type: String, required: true },
    vitalSigns: {
        temperature: { type: Number, required: true },
        bloodPressure: { type: String, required: true },
        heartRate: { type: Number, required: true },
        respiratoryRate: { type: Number, required: true }
    }
});

const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', noteSchema);

const PhysicianNote = Note.discriminator('PhysicianNote', physicianNoteSchema);
const ProcedureNote = Note.discriminator('ProcedureNote', procedureNoteSchema);
const SubjectiveNote = Note.discriminator('SubjectiveNote', subjectiveNoteSchema);
const TriageNote = Note.discriminator('TriageNote', triageNoteSchema);

export { Note, PhysicianNote, ProcedureNote, SubjectiveNote, TriageNote };
export type { INote, IPhysicianNote, IProcedureNote, ISubjectiveNote, ITriageNote };