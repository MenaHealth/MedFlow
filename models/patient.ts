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
  laterality?: 'Left' | 'Right' | 'Bilateral';
  diagnosis?: string;
  diagnosisCat?: string;
  hospital?: 'PMC' | 'PRCS' | 'Hugo Chavez';
  priority?: 'Low' | 'Medium' | 'High';
  specialty?: typeof SPECIALTIES[number];
  status?: 'Active' | 'Inactive';
  age?: number;
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
  notes?: string;
  visits?: Types.ObjectId[];
}

const PatientSchema = new Schema<IPatient>({
  patientId: { type: String, required: true, unique: true },
  files: { type: [{
    hash: { type: String },
    encryptionKey: { type: String },
  }] },
  laterality: { type: String, enum: ['Left', 'Right', 'Bilateral'] },
  diagnosis: { type: String },
  diagnosisCat: { type: String, enum: [''] },
  hospital: { type: String, enum: ['PMC', 'PRCS', 'Hugo Chavez'] },
  priority: { type: String, enum: ['Low', 'Medium', 'High'] },
  specialty: { type: String, enum: SPECIALTIES },
  status: { type: String, enum: ['Active', 'Inactive'] },
  age: { type: Number },
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
  notes: { type: String },
  visits: [{ type: Types.ObjectId, ref: 'Visit' }],
});

const Patient = models.Patient || model<IPatient>('Patient', PatientSchema);

export default Patient;