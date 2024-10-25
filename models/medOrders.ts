// models/medOrders.ts

import { Schema, Document, Model, model, models } from 'mongoose';
import { DoctorSpecialties } from './../data/doctorSpecialty.enum';

export interface IMedOrder extends Document {
    orderDate: Date;
    doctorSpecialization: typeof DoctorSpecialties[number];
    doctorEmail: string;
    prescribingDr: string;
    drId: string;
    order: {
        patientName: string;
        patientNumber: string;
        patientCity: string;
        medications: {
            diagnosis: string;
            medication: string;
            dosage: string;
            frequency: string;
            quantity: string;
        }[];
    };
}

export const medOrderSchema = new Schema<IMedOrder>({
    orderDate: { type: Date, default: Date.now },
    doctorSpecialization: { type: String, enum: DoctorSpecialties, required: true },
    doctorEmail: { type: String, required: true },
    prescribingDr: { type: String, required: true },
    drId: { type: String, required: true },
    order: {
        patientName: { type: String, required: true },
        patientNumber: { type: String, required: true },
        patientCity: { type: String, required: true },
        medications: [
            {
                diagnosis: { type: String, required: true },
                medication: { type: String, required: true },
                dosage: { type: String, required: true },
                frequency: { type: String, required: true },
                quantity: { type: String, required: true },
            },
        ],
    },
});

const MedOrders: Model<IMedOrder> = models.MedOrders || model<IMedOrder>('MedOrders', medOrderSchema);

export default MedOrders;