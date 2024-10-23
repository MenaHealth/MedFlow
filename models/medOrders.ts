// models/medOrders.ts

import { Schema, Document, Model, model, models, Types } from 'mongoose';
import { DoctorSpecialties } from './../data/doctorSpecialty.enum';

export interface IMedOrders extends Document {
    patientId: Types.ObjectId; // Reference to the patient
    doctorId?: Types.ObjectId;  // Optional reference to the doctor
    email: string;
    date: Date;
    authorName: string;
    authorID: string;
    content: {
        doctorSpecialty: keyof typeof DoctorSpecialties;
        patientName: string;
        city: string; // Added city field similar to RX order
        medications: string;
        dosage: string;
        frequency: string;
    };
}

export const medOrdersSchema = new Schema<IMedOrders>({
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true }, // Reference to the patient
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' }, // Optional reference to the doctor
    email: { type: String },
    date: { type: Date, default: Date.now },
    authorName: { type: String },
    authorID: { type: String },
    content: {
        doctorSpecialty: { type: String, enum: Object.keys(DoctorSpecialties), required: true },
        patientName: { type: String },
        city: { type: String, required: true }, // Added city field
        medications: { type: String },
        dosage: { type: String },
        frequency: { type: String },
    },
});

const MedOrders: Model<IMedOrders> = models.MedOrders || model<IMedOrders>('MedOrders', medOrdersSchema);

export default MedOrders;