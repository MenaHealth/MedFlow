// models/medOrder.ts

import { Schema, Document, Model, model, models, Types } from 'mongoose';
import { DoctorSpecialtyList } from './../data/doctorSpecialty.enum';

export interface IMedOrder extends Document {
    doctorSpecialization: string;
    prescribingDr: string;
    drEmail: string;
    drId: string;
    orderDate: Date;
    patientName: string;
    patientPhone: string;
    patientCity: string;
    patientId: Types.ObjectId;
    validated: boolean;
    medications: Array<{
        diagnosis: string;
        medication: string;
        dosage: string;
        frequency: string;
        quantity: string;
    }>;
}

export const medOrderSchema = new Schema<IMedOrder>({
    doctorSpecialization: { type: String, enum: Object.values(DoctorSpecialtyList), required: true },
    prescribingDr: { type: String, required: true },
    drEmail: { type: String, required: true },
    drId: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
    patientName: { type: String, required: true },
    patientPhone: { type: String, required: true },
    patientCity: { type: String, required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    validated: { type: Boolean, default: false },
    medications: [{
        diagnosis: { type: String, required: true },
        medication: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        quantity: { type: String, required: true },
    }]
});

const MedOrder: Model<IMedOrder> = models.MedOrder || model<IMedOrder>('MedOrder', medOrderSchema);

export default MedOrder;