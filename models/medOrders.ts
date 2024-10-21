// models/medOrders.ts

import { Schema, Document, Model, model, models } from 'mongoose';
import { DoctorSpecialties } from './../data/doctorSpecialty.enum';

export interface IMedOrders extends Document {
    email: string;
    date: Date;
    authorName: string;
    authorID: string;
    content: {
        doctorSpecialty: typeof DoctorSpecialties[number];
        patientName: string;
        phoneNumber: string;
        address: string;
        diagnosis: string;
        medications: string;
        dosage: string;
        frequency: string;
    };
}

export const medOrdersSchema = new Schema<IMedOrders>({
    email: { type: String },
    date: { type: Date, default: Date.now },
    authorName: { type: String },
    authorID: { type: String },
    content: {
        doctorSpecialty: { type: String, enum: DoctorSpecialties },
        patientName: { type: String },
        phoneNumber: { type: String }, // Changed from patientPhoneNumber
        address: { type: String },
        diagnosis: { type: String },
        medications: { type: String },
        dosage: { type: String },
        frequency: { type: String },
    },
});

const MedOrders: Model<IMedOrders> = models.MedOrders || model<IMedOrders>('MedOrders', medOrdersSchema);

export default MedOrders;