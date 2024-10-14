import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the base Note interface
interface INote extends Document {
    email: string;
    noteType: 'physician' | 'procedure' | 'subjective' | 'triage';
    date: Date;
}

// Define schemas for each note type
const noteSchema = new Schema<INote>({
    email: { type: String, required: true },
    noteType: { type: String, enum: ['physician', 'procedure', 'subjective', 'triage'], required: true },
    date: { type: Date, default: Date.now },
});

// Define the base Note model
const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', noteSchema);

// Define additional interfaces for the specific note types
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
    attendingPhysician: string;
    procedureName: string;
    diagnosis: string;
    notes: string;
    plan: string;
}

interface ISubjectiveNote extends INote {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
}

interface ITriageNote extends INote {
    note: string;
}

// Define discriminators conditionally to prevent redeclaration
const PhysicianNote = Note.discriminators?.PhysicianNote || Note.discriminator<IPhysicianNote>('PhysicianNote', new Schema<IPhysicianNote>({
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
}));

const ProcedureNote = Note.discriminators?.ProcedureNote || Note.discriminator<IProcedureNote>('ProcedureNote', new Schema<IProcedureNote>({
    attendingPhysician: { type: String, required: true },
    procedureName: { type: String, required: true },
    diagnosis: { type: String, required: true },
    notes: { type: String, required: true },
    plan: { type: String, required: true }
}));

const SubjectiveNote = Note.discriminators?.SubjectiveNote || Note.discriminator<ISubjectiveNote>('SubjectiveNote', new Schema<ISubjectiveNote>({
    subjective: { type: String, required: true },
    objective: { type: String, required: true },
    assessment: { type: String, required: true },
    plan: { type: String, required: true }
}));

const TriageNote = Note.discriminators?.TriageNote || Note.discriminator<ITriageNote>('TriageNote', new Schema<ITriageNote>({
    note: { type: String, required: true },
}));

export { Note, PhysicianNote, ProcedureNote, SubjectiveNote, TriageNote };
export type { INote, IPhysicianNote, IProcedureNote, ISubjectiveNote };