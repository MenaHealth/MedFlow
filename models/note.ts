// models/note.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the base Note interface with a flexible content field
export interface INote extends Document {
    email: string;
    noteType: 'physician' | 'procedure' | 'subjective' | 'triage';
    date: Date;
    authorName?: string;
    authorID?: string;
    content?: Record<string, any>; // Flexible field for content
}

// Define the base schema for the Note
export const noteSchema = new Schema<INote>({
    email: { type: String, required: true },
    noteType: { type: String, enum: ['physician', 'procedure', 'subjective', 'triage'], required: true },
    date: { type: Date, default: Date.now },
    authorName: { type: String },
    authorID: { type: String },
    content: { type: Schema.Types.Mixed },
});

// Define the base Note model
const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', noteSchema);

export interface ITriageNote extends INote {
    content: {
        triageDetails: string;
    };
}

// Define additional interfaces for the specific note types
export interface IPhysicianNote extends INote {
    content: {
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
    };
}

export interface IProcedureNote extends INote {
    content: {
        attendingPhysician: string;
        procedureName: string;
        diagnosis: string;
        notes: string;
        plan: string;
    };
}

export interface ISubjectiveNote extends INote {
    content: {
        subjective: string;
        objective: string;
        assessment: string;
        plan: string;
    };
}

const PhysicianNote = Note.discriminators?.PhysicianNote || Note.discriminator<IPhysicianNote>('PhysicianNote', new Schema<IPhysicianNote>({
    content: {
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
        signature: { type: String, required: true },
    },
}));

const ProcedureNote = Note.discriminators?.ProcedureNote || Note.discriminator<IProcedureNote>('ProcedureNote', new Schema<IProcedureNote>({
    content: {
        attendingPhysician: { type: String, required: true },
        procedureName: { type: String, required: true },
        diagnosis: { type: String, required: true },
        notes: { type: String, required: true },
        plan: { type: String, required: true },
    },
}));

const SubjectiveNote = Note.discriminators?.SubjectiveNote || Note.discriminator<ISubjectiveNote>('SubjectiveNote', new Schema<ISubjectiveNote>({
    content: {
        subjective: { type: String, required: true },
        objective: { type: String, required: true },
        assessment: { type: String, required: true },
        plan: { type: String, required: true },
    },
}));

export { Note, PhysicianNote, ProcedureNote, SubjectiveNote };