// models/patient.ts
import { Schema, model, models, Document, Types } from 'mongoose';
import { DoctorSpecialties as SPECIALTIES } from './../data/doctorSpecialty.enum';
import { INote, noteSchema } from './note';


export interface IRxOrder {
    _id?: Types.ObjectId; // Use Types.ObjectId for proper typing
    rxOrderId: string;
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
    RxDispenserName?: string;
    RxDispenserContact?: string;
    rxStatus?: 'not reviewed' | 'partially filled' | 'declined' | 'completed';
    submitted?: boolean;
    partialRxNotes?: string;
}

// rxOrderSchema
const rxOrderSchema = new Schema({
    rxOrderId: { type: String, required: true },
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
    PatientRxUrl: { type: String },
    PharmacyQrCode: { type: String },
    PharmacyQrUrl: { type: String },
    RxDispenserName: { type: String },
    RxDispenserContact: { type: String },
    rxStatus: {
        type: String,
        enum: ['not reviewed', 'partially filled', 'declined', 'completed'],
    },
    submitted: { type: Boolean, default: false },
    partialRxNotes: { type: String },
});

export interface IPatient extends Document {
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
    telegramChatId?: string;
    telegramAccessHash?: string;
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
    rxOrders?: IRxOrder[];
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
    isPatient?: boolean;
    patientRelation?: string;
    createdAt?: Date;
    updatedAt?: Date;
    hasSubmittedInfo?: boolean;
}


const PatientSchema = new Schema<IPatient>({
    firstName: { type: String },
    lastName: { type: String },
    bmi: { type: String },
    phone: {
        countryCode: { type: String },
        phoneNumber: { type: String },
    },
    telegramChatId: { type: String },
    telegramAccessHash: { type: String },
    dob: { type: Date },
    city: { type: String },
    country: { type: String },
    genderPreference: { type: String },
    previouslyRegistered: { type: String },
    language: {
        type: String,
        enum: ['English', 'Arabic', 'Farsi', 'Pashto'],
    },
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
    rxOrders: {
        type: [rxOrderSchema],
        required: false,
        default: undefined,
    },
    medOrders: {
        type: [{ type: Schema.Types.ObjectId, ref: 'MedOrder' }],
        required: false, // Make it optional
        default: undefined, // Prevent default empty array
    },
    visits: [{ type: Schema.Types.ObjectId, ref: 'Visit' }],
    triagedBy: { type: Object },
    doctor: { type: Object },
    isPatient: { type: Boolean, default: undefined },
    patientRelation: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    hasSubmittedInfo: { type: Boolean, default: false }
});

const Patient = models.Patient || model<IPatient>('Patient', PatientSchema);

export default Patient;