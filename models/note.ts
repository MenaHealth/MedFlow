    // models/note.ts
    import mongoose, { Schema, Document, Model } from 'mongoose';


    const noteSchema = new Schema<INote>({
        email: { type: String, required: true },
        noteType: { type: String, enum: ['physician', 'procedure', 'subjective', 'triage'], required: true },
        date: { type: Date, default: Date.now },
    });

    interface INote extends Document {
        email: string;
        noteType: 'physician' | 'procedure' | 'subjective' | 'triage';
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

    const physicianNoteSchema = new Schema<IPhysicianNote>({
        noteType: { type: String, enum: ['physician'], required: true },
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
        noteType: { type: String, enum: ['procedure'], required: true },
        attendingPhysician: { type: String, required: true },
        procedureName: { type: String, required: true },
        diagnosis: { type: String, required: true },
        notes: { type: String, required: true },
        plan: { type: String, required: true }
    });

    const subjectiveNoteSchema = new Schema<ISubjectiveNote>({
        noteType: { type: String, enum: ['subjective'], required: true },
        subjective: { type: String, required: true },
        objective: { type: String, required: true },
        assessment: { type: String, required: true },
        plan: { type: String, required: true }
    });

    const triageNoteSchema = new Schema<ITriageNote>({
        noteType: { type: String, enum: ['triage'], required: true },
        note: { type: String, required: true },
    });



    const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', noteSchema);
    const PhysicianNote = Note.discriminator('PhysicianNote', physicianNoteSchema);
    const ProcedureNote = Note.discriminator('ProcedureNote', procedureNoteSchema);
    const SubjectiveNote = Note.discriminator('SubjectiveNote', subjectiveNoteSchema);
    const TriageNote = Note.discriminator('TriageNote', triageNoteSchema);

    export { Note, PhysicianNote, ProcedureNote, SubjectiveNote, TriageNote };
    export type { INote, IPhysicianNote, IProcedureNote, ISubjectiveNote, ITriageNote };