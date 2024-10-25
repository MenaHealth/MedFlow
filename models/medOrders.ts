// models/medOrders.ts

import { Schema, Document, Model, model, models, Types } from 'mongoose';
import { DoctorSpecialties } from './../data/doctorSpecialty.enum';

interface MedicationDetails {
    medication: string;
    dosage: string;
    frequency: string;
}

export interface IMedOrders extends Document {
    doctorId?: Types.ObjectId;
    doctorSpecialty: keyof typeof DoctorSpecialties;
    doctorEmail: string;
    patientName: string;
    patientId: Types.ObjectId;
    medications: MedicationDetails[]; // Updated to support multiple medications
    city: string;
    date: Date;
}

export const medOrdersSchema = new Schema<IMedOrders>({
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' },
    doctorSpecialty: { type: String, enum: Object.keys(DoctorSpecialties), required: true },
    doctorEmail: { type: String },
    date: { type: Date, default: Date.now },
    city: { type: String, required: true }, // Added city field
    medications: [
        {
            medication: { type: String, required: true },
            dosage: { type: String, required: true },
            frequency: { type: String, required: true },
        }
    ]
});

const MedOrders: Model<IMedOrders> = models.MedOrders || model<IMedOrders>('MedOrders', medOrdersSchema);

export default MedOrders;