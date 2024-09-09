// models/note.ts
import { Schema, model, models, Document } from 'mongoose';

interface INote extends Document {
    date: Date;
    content: string;
    username: string;
    patientId: Schema.Types.ObjectId;
    title: string;
    procedureName?: string;  
    physician?: string;
    diagnosis?: string;
    notes?: string;
    plan?: string;
}

const noteSchema = new Schema<INote>({
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },  
    username: { type: String, required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    title: { type: String, required: true },
    procedureName: String,
    physician: String,
    diagnosis: String,
    notes: String,
    plan: String,
});

const Note = models.Note || model<INote>('Note', noteSchema, 'notes');

export default Note;
