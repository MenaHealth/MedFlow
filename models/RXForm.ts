// models/RXForm.ts
import { Schema, Document, Model, model, models } from 'mongoose';
import { Pharmacies } from '@/data/pharmacies.enum';

export interface IRXForm extends Document {
    email: string;
    date: Date;
    authorName: string;
    authorID: string;
    content: {
        diagnosis: string;
        medicationsNeeded: string;
        pharmacyOrClinic: string;
        medication: string;
        dosage: string;
        frequency: string;
    };
}

export const rxFormSchema = new Schema<IRXForm>({
    email: { type: String, required: true },
    date: { type: Date, default: Date.now },
    authorName: { type: String, required: true },
    authorID: { type: String, required: true },
    content: {
        diagnosis: { type: String, required: true },
        medicationsNeeded: { type: String, required: true },
        pharmacyOrClinic: { type: String, enum: Pharmacies, required: true }, // Restrict to enum
        medication: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
    },
});

export const RXForm: Model<IRXForm> = models.RXForm || model<IRXForm>('RXForm', rxFormSchema);