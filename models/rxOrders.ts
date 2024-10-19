// models/rxOrders.ts
import { Schema, Document, Model, model, models } from 'mongoose';
import { Pharmacies } from './../data/pharmacies.enum';

export interface IRXForm extends Document {
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
        patientName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        age: { type: String, required: true },
        address: { type: String, required: true },
        referringDr: { type: String, required: true },
        prescribingDr: { type: String, required: true },
        diagnosis: { type: String, required: true },
        medicationsNeeded: { type: String, required: true },
        pharmacyOrClinic: { type: String, enum: Pharmacies, required: true },
        medication: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
    },
});

const RxOrders: Model<IRXForm> = models.RxOrders || model<IRXForm>('RxOrders', rxFormSchema);

export default RxOrders;