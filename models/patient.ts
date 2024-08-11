// models/patient.ts
import { Schema, model, models, Document, Types } from 'mongoose';
import { SPECIALTIES } from '@/data/data';

interface Prescription {
  medName: string;
  medDosage: string;
  medFrequency: string;
}

export interface IPatient extends Document {
  _id?: string;
  files: any[];
  patientId: string;
  firstName: string; // New field
  lastName: string;  // New field
  laterality?: 'Left' | 'Right' | 'Bilateral';
  diagnosis?: string;
  diagnosisCat?: string;
  hospital?: 'PMC' | 'PRCS' | 'Hugo Chavez';
  priority?: 'Routine' | 'Moderate' | 'Urgent' | 'Emergency';
  specialty?: typeof SPECIALTIES[number];
  status?: 'Not Started' | 'Triaged' | 'In-Progress' | 'Completed';
  age?: number;
  name?: string;
  phone?: string;
  location?: string;
  language?: string;
  complaint?: string;
  icd10?: string;
  surgeryDate?: Date;
  occupation?: string;
  baselineAmbu?: 'Independent' | 'Boot' | 'Crutches' | 'Walker' | 'Non-Ambulatory';
  pmhx?: string[];
  pshx?: string[];
  medx?: Prescription[];
  smokeCount?: string;
  drinkCount?: string;
  otherDrugs?: string;
  allergies?: string;
  triagedBy?: string;
  doctor?: string;
  notes?: string;
  visits?: Types.ObjectId[];
}

const PatientSchema = new Schema<IPatient>({
  patientId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true }, // New field
  lastName: { type: String, required: true },  // New field
  files: { type: [{
      hash: { type: String },
      encryptionKey: { type: String },
    }] },
  laterality: { type: String, enum: ['Left', 'Right', 'Bilateral'] },
  diagnosis: { type: String },
  diagnosisCat: { type: String, enum: [''] },
  hospital: { type: String, enum: ['PMC', 'PRCS', 'Hugo Chavez'] },
  priority: { type: String, enum: ['Routine', 'Moderate', 'Urgent', 'Emergency'] },
  specialty: { type: String, enum: SPECIALTIES },
  status: { type: String, enum: ['Not Started', 'Triaged', 'In-Progress', 'Completed'] },
  age: { type: Number },
  name: { type: String },
  phone: { type: String },
  location: { type: String },
  language: { type: String },
  complaint: { type: String },
  icd10: { type: String },
  surgeryDate: { type: Date },
  occupation: { type: String },
  baselineAmbu: {
    type: String,
    enum: ['Independent', 'Boot', 'Crutches', 'Walker', 'Non-Ambulatory'],
  },
  pmhx: { type: [String] },
  pshx: { type: [String] },
  medx: [{
    medName: { type: String },
    medDosage: { type: String },
    medFrequency: { type: String }
  }],
  smokeCount: { type: String },
  drinkCount: { type: String },
  otherDrugs: { type: String },
  allergies: { type: String },
  triagedBy: { type: String },
  doctor: { type: String },
  notes: { type: String },
  visits: [{ type: Types.ObjectId, ref: 'Visit' }],
});

const Patient = models.Patient || model<IPatient>('Patient', PatientSchema);

export default Patient;