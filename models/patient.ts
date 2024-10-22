// models/patient.ts
import { Schema, model, models, Document, Types } from 'mongoose';
import { DoctorSpecialties as SPECIALTIES } from './../data/doctorSpecialty.enum';
import { INote, noteSchema } from './note';
import {IRxOrder, RXOrderSchema} from "./rxOrders";
import {IMedOrders, medOrdersSchema} from "./medOrders";


  interface Prescription {
    medName: string;
    medDosage: string;
    medFrequency: string;
  }

export interface IPatient extends Document {
  files?: any[];
  firstName: string;
  lastName: string;
  phone?: string;
  age?: string;
  dob?: Date;
  country?: string;
  city?: string;
  language?: string;
  genderPreference?: string;
  previouslyRegistered?: string;
  chiefComplaint?: string;
  coordinatorId?: string;
  email?: string; // This makes email optional
  laterality?: 'Not Selected' | 'Left' | 'Right' | 'Bilateral';
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
  pmhx?: string[];
  pshx?: string[];
  smokeCount?: string;
  drinkCount?: string;
  otherDrugs?: string;
  allergies?: string;
  notes?: Types.DocumentArray<INote>;
  rxOrders?: Types.DocumentArray<IRxOrder>;
  medOrders?: Types.DocumentArray<IMedOrders>;
  visits?: any[];
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

  // models/patient.ts

const PatientSchema = new Schema<IPatient>({
  files: [{ type: Object }],
  firstName: { type: String, required: true },
  lastName: { type: String },
  phone: { type: String },
  age: { type: String },
  dob: { type: Date },
  city: { type: String },
  country: { type: String },
  genderPreference: { type: String },
  previouslyRegistered: { type: String },
  language: { type: String },
  chiefComplaint: { type: String },
  email: { type: String },
  laterality: { type: String, enum: ['Not Selected', 'Left', 'Right', 'Bilateral'], default: 'Not Selected' },
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
  pmhx: { type: [String], default: [] },
  pshx: { type: [String], default: [] },
  smokeCount: { type: String },
  drinkCount: { type: String },
  otherDrugs: { type: String },
  allergies: { type: String },
  notes: { type: [noteSchema], default: [] },
  rxOrders: {
    type: [{
      email: { type: String, required: true },
      date: { type: Date, default: Date.now },
      authorName: { type: String, required: true },
      authorID: { type: String, required: true },
      content: {
        patientName: { type: String, required: true },
        phoneNumber: { type: String },
        age: { type: String },
        diagnosis: { type: String, required: true },
        pharmacyOrClinic: { type: String, required: true },
        doctorSpecialty: { type: String, required: true },
        prescriptions: [{
          medication: { type: String, required: true },
          dosage: { type: String, required: true },
          frequency: { type: String, required: true },
        }]
      }
    }],
    default: []
  },
  medOrders: { type: [medOrdersSchema], default: [] },
  visits: [{ type: Schema.Types.ObjectId, ref: 'Visit' }],
  triagedBy: { type: Object },
  doctor: { type: Object },
createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
  });

const Patient = models.Patient || model<IPatient>('Patient', PatientSchema);

export default Patient;