// models/medX.ts
import { Schema, Document, Model, model, models } from 'mongoose';
import { DoctorSpecialties } from './../data/doctorSpecialty.enum';

export interface IMedX extends Document {
    email: string;
    date: Date;
    authorName: string;
    authorID: string;
    content: {
        doctorSpecialty: typeof DoctorSpecialties[number];
        patientName: string;
        patientPhoneNumber: string;
        patientAddress: string;
        diagnosis: string;
        medications: string;
        dosage: string;
        frequency: string;
    };
}

export const medXSchema = new Schema<IMedX>({
    email: { type: String, required: true },
    date: { type: Date, default: Date.now },
    authorName: { type: String, required: true },
    authorID: { type: String, required: true },
    content: {
        doctorSpecialty: { type: String, enum: DoctorSpecialties, required: true },
        patientName: { type: String, required: true },
        patientPhoneNumber: { type: String, required: true },
        patientAddress: { type: String, required: true },
        diagnosis: { type: String, required: true },
        medications: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
    },
});

export const MedX: Model<IMedX> = models.MedX || model<IMedX>('MedX', medXSchema);