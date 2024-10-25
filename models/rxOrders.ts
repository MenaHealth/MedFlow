// models/rxOrders.ts
import { Schema, Document, Model, model, models } from 'mongoose';
import { Pharmacies } from './../data/pharmacies.enum';
import { DoctorSpecialtyList } from './../data/doctorSpecialty.enum';

interface Prescription {
    medication: string;
    dosage: string;
    frequency: string;
}

export interface IRxOrder extends Document {
    email: string;
    date: Date;
    authorName: string;
    authorID: string;
    content: {
        patientName: string;
        phoneNumber: string;
        age: string;
        diagnosis: string;
        pharmacyOrClinic: typeof Pharmacies[number];
        doctorSpecialty: keyof typeof DoctorSpecialtyList;
        prescriptions: Prescription[];
    };
}

export const RXOrderSchema = new Schema<IRxOrder>({
    email: { type: String, required: true },
    date: { type: Date, default: Date.now },
    authorName: { type: String, required: true },
    authorID: { type: String, required: true },
    content: {
        patientName: { type: String, required: true },
        phoneNumber: { type: String },
        age: { type: String },
        diagnosis: { type: String, required: true },
        pharmacyOrClinic: { type: String, enum: Pharmacies, required: true },
        prescriptions: [{
            medication: { type: String, required: true },
            dosage: { type: String, required: true },
            frequency: { type: String, required: true },
        }],
    },
});

const RxOrders: Model<IRxOrder> = models.RxOrders || model<IRxOrder>('RxOrders', RXOrderSchema);
export default RxOrders;