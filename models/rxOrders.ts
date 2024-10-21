// models/rxOrders.ts
import { Schema, Document, Model, model, models } from 'mongoose';
import { Pharmacies } from './../data/pharmacies.enum';

export interface IRxOrder extends Document {
    email: string;
    date: Date;
    authorName: string;
    authorID: string;
    content: {
        patientName: string;
        phoneNumber: string;
        age: string;
        address: string;
        referringDr: string;
        prescribingDr: string;
        diagnosis: string;
        pharmacyOrClinic: typeof Pharmacies[number];
        medication: string;
        dosage: string;
        frequency: string;
    };
}

export const RXOrderSchema = new Schema<IRxOrder>({
    email: { type: String },
    date: { type: Date, default: Date.now },
    authorName: { type: String },
    authorID: { type: String },
    content: {
        pharmacyOrClinic: { type: String, enum: Pharmacies },
        patientName: { type: String },
        phoneNumber: { type: String },
        age: { type: String },
        address: { type: String },
        referringDr: { type: String },
        prescribingDr: { type: String },
        diagnosis: { type: String },
        medication: { type: String },
        dosage: { type: String },
        frequency: { type: String },
    },
});

const RxOrders: Model<IRxOrder> = models.RxOrders || model<IRxOrder>('RxOrders', RXOrderSchema);

export default RxOrders;