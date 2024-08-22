// models/patient.ts
import { Schema, model, models, Document, Types } from 'mongoose';
import { SPECIALTIES } from '@/data/data';

interface Prescription {
  medName: string;
  medDosage: string;
  medFrequency: string;
}

export interface IPatient extends Document {
  files: any[];
  _id?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  age?: string;
  location?: string;
  language?: string;
  chiefComplaint?: string;
  coordinatorId?: string;
  laterality?: 'Not Selected' | 'Left' | 'Right' | 'Bilateral';
  diagnosis?: string;
  diagnosisCat?: string;
  hospital?: 'Not Selected' | 'PMC' | 'PRCS' | 'Hugo Chavez';
  priority?: 'Not Selected' | 'Routine' | 'Moderate' | 'Urgent' | 'Emergency';
  specialty?: typeof SPECIALTIES[number];
  status?: 'Not Selected' | 'Not Started' | 'Triaged' | 'In-Progress' | 'Completed';
  name?: string;
  complaint?: string;
  icd10?: string;
  surgeryDate?: Date;
  occupation?: string;
  baselineAmbu?: 'Not Selected' | 'Independent' | 'Boot' | 'Crutches' | 'Walker' | 'Non-Ambulatory';
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
  files: [{ type: Object }],
  firstName: { type: String, required: true },
  lastName: { type: String },
  phone: { type: String },
  age: { type: String },
  location: { type: String },
  language: { type: String },
  chiefComplaint: { type: String },
  laterality: { type: String, enum: ['Not Selected', 'Left', 'Right', 'Bilateral'], default: 'Not Selected' },
  diagnosis: { type: String },
  diagnosisCat: { type: String },
  hospital: { type: String, enum: ['Not Selected', 'PMC', 'PRCS', 'Hugo Chavez'], default: 'Not Selected' },
  priority: { type: String, enum: ['Not Selected', 'Routine', 'Moderate', 'Urgent', 'Emergency'], default: 'Not Started' },
  specialty: { type: String, enum: ['Not Selected', 'Podiatry', 'Sports', 'Vascular', 'General', 'Urology', 'OBGYN', 'Opthalmology', 'ENT', 'Joints', 'Pediatrics', 'Spine/Neurosurgery', 'Internal Medicine'], default: 'Not Started' },
  icd10: { type: String },
  surgeryDate: { type: Date },
  occupation: { type: String },
  baselineAmbu: { type: String, enum: ['Not Selected', 'Independent', 'Boot', 'Crutches', 'Walker', 'Non-Ambulatory'] },
  pmhx: { type: [String], default: [] },
  pshx: { type: [String], default: [] },
  medx: [{
    medName: { type: String },
    medDosage: { type: String },
    medFrequency: { type: String }
  }],
  smokeCount: { type: String },
  drinkCount: { type: String },
  otherDrugs: { type: String },
  allergies: { type: String },
  notes: { type: String },
  visits: [{ type: Schema.Types.ObjectId, ref: 'Visit' }],
});

const Patient = models.Patient || model<IPatient>('Patient', PatientSchema);

export default Patient;