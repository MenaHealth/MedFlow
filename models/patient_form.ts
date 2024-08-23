// models/patient_form.ts
import { Schema, model, models, Document } from 'mongoose';

export interface IPatientForm extends Document {
    _id?: string;
    patientId?: string;
    phone?: string;
    email: string;
    firstName: string;
    lastName: string;
    age?: string;
    location?: string;
    language?: string;
    chiefComplaint?: string;
}

const PatientFormSchema = new Schema<IPatientForm>({
    patientId: { type: String, required: true, unique: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: String },
    location: { type: String },
    language: { type: String },
    chiefComplaint: { type: String },
}, {
    collection: 'patient_forms'
});

const PatientForm = models.PatientForm || model<IPatientForm>('PatientForm', PatientFormSchema);

export default PatientForm;