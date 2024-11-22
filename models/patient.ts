// models/patient.ts
import { Schema, model, models, Document, Types } from 'mongoose';
import { DoctorSpecialties as SPECIALTIES } from './../data/doctorSpecialty.enum';
import { INote, noteSchema } from './note';
export interface IRxOrder {
    _id?: string;
    doctorSpecialty: string;
    prescribingDr: string;
    drEmail: string;
    drId: string;
    prescribedDate: Date;
    validTill: Date;
    city: string;
    prescriptions: Array<{
        diagnosis: string;
        medication: string;
        dosage: string;
        frequency: string;
    }>;
    PatientRxUrl?: string;
    PharmacyQrCode?: string;
    PharmacyQrUrl?: string;
    RxProvider?: string;
    rxStatus?: 'not reviewed' | 'partially filled' | 'declined' | 'completed';
    partialRxNotes?: string;
}

const rxOrderSchema = new Schema({
    doctorSpecialty: { type: String, required: true },
    prescribingDr: { type: String, required: true },
    drEmail: { type: String, required: true },
    drId: { type: String, required: true },
    prescribedDate: { type: Date, required: true },
    validTill: { type: Date, required: true },
    city: { type: String, required: true },
    prescriptions: [
        {
            diagnosis: { type: String, required: true },
            medication: { type: String, required: true },
            dosage: { type: String, required: true },
            frequency: { type: String, required: true },
        },
    ],
    PatientRxUrl: { type: String},
    PharmacyQrCode: { type: String },
    PharmacyQrUrl: { type: String},
    RxProvider: { type: String},
    rxStatus: {
        type: String,
        default: 'not reviewed',
        enum: ['not reviewed', 'partially filled', 'declined', 'completed'],
    },
    partialRxNotes: { type: String},
});

export interface IPatient extends Document {
    files?: any[];
    firstName: string;
    lastName: string;
    phone?: {
        countryCode: string;
        phoneNumber: string;
    }
    bmi?: string;
    dob?: Date;
    country?: string;
    city?: string;
    language?: string;
    genderPreference?: string;
    previouslyRegistered?: string;
    chiefComplaint?: string;
    coordinatorId?: string;
    email?: string;
    diagnosis?: string;
    diagnosisCat?: string;
    hospital?: 'Not Selected' | 'PMC' | 'PRCS' | 'Hugo Chavez';
    priority?: 'Not Selected' | 'Routine' | 'Moderate' | 'Urgent' | 'Emergency';
    specialty?: typeof SPECIALTIES[number];
    status?: 'Not Selected' | 'Not Started' | 'Triaged' | 'In-Progress' | 'Completed' | 'Archived';
    complaint?: string;
    icd10?: string;
    surgeryDate?: Date;
    occupation?: string;
    baselineAmbu?: 'Not Selected' | 'Independent' | 'Boot' | 'Crutches' | 'Walker' | 'Non-Ambulatory';
    pmhx?: string;
    pshx?: string;
    famhx?: string;
    smokeCount?: string;
    drinkCount?: string;
    otherDrugs?: string;
    allergies?: string;
    dashboardNotes?: string;
    notes?: Types.DocumentArray<INote>;
    rxOrders?: string[];
    medOrders?: Types.ObjectId[];
    visits?: any[];
    prevMeds?: string;
    currentMeds?: string;
    triagedBy?: {
        firstName?: string;
        lastName?: string;
        email?: string;
    };
    doctor?: {
        firstName?: string;
        lastName?: string;
        email?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}


const PatientSchema = new Schema<IPatient>({
    files: [{ type: Object }],
    firstName: { type: String, required: true },
    lastName: { type: String },
    bmi: { type: String },
    phone: {
        countryCode: { type: String },
        phoneNumber: { type: String },
    },
    dob: { type: Date },
    city: { type: String },
    country: { type: String },
    genderPreference: { type: String },
    previouslyRegistered: { type: String },
    language: { type: String },
    chiefComplaint: { type: String },
    email: { type: String },
    diagnosis: { type: String },
    diagnosisCat: { type: String },
    hospital: { type: String, enum: ['Not Selected', 'PMC', 'PRCS', 'Hugo Chavez'], default: 'Not Selected' },
    priority: { type: String, enum: ['Not Selected', 'Routine', 'Moderate', 'Urgent', 'Emergency'], default: 'Not Selected' },
    specialty: { type: String, enum: ['Not Selected', ...SPECIALTIES], default: 'Not Selected' },
    status: { type: String, enum: ['Not Selected', 'Not Started', 'Triaged', 'In-Progress', 'Completed', 'Archived'], default: 'Not Started' },
    icd10: { type: String },
    surgeryDate: { type: Date },
    occupation: { type: String },
    baselineAmbu: { type: String, enum: ['Not Selected', 'Independent', 'Boot', 'Crutches', 'Walker', 'Non-Ambulatory'] },
    pmhx: { type: String },
    pshx: { type: String },
    famhx: { type: String },
    smokeCount: { type: String },
    drinkCount: { type: String },
    otherDrugs: { type: String },
    allergies: { type: String },
    prevMeds: { type: String },
    currentMeds: { type: String },
    notes: { type: [noteSchema], default: [] },
    dashboardNotes: { type: String },
    rxOrders: { type: [rxOrderSchema], required: false },
    medOrders: [{ type: Schema.Types.ObjectId, ref: 'MedOrder', required: false }],
    visits: [{ type: Schema.Types.ObjectId, ref: 'Visit' }],
    triagedBy: { type: Object },
    doctor: { type: Object },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const Patient = models.Patient || model<IPatient>('Patient', PatientSchema);

export default Patient;