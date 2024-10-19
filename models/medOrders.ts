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
        patientPhoneNumber: string;
        patientAddress: string;
        diagnosis: string;
        medications: string;
        dosage: string;
        frequency: string;
    };
}

export const medOrdersSchema = new Schema<IMedOrders>({
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

// Check if the model already exists before defining it
const MedOrders: Model<IMedOrders> = models.MedOrders || model<IMedOrders>('MedOrders', medOrdersSchema);

export default MedOrders;