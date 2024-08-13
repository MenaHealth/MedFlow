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
    patientId: string;
    firstName: string;
    lastName: string;
    phoneNumber? : string;
    age?: number;
    location?: string;
    language?: string;
    chiefComplaint?: string;
    coordinatorId?: string;
    files: any[];
    laterality?: 'Not Selected' | 'Left' | 'Right' | 'Bilateral';
    diagnosis?: string;
    diagnosisCat?: string;
    hospital?: 'Not Selected' | 'PMC' | 'PRCS' | 'Hugo Chavez';
    priority?: 'Not Selected' | 'Routine' | 'Moderate' | 'Urgent' | 'Emergency';
    specialty?: typeof SPECIALTIES[number];
    status?: 'Not Selected' | 'Not Started' | 'Triaged' | 'In-Progress' | 'Completed';
    name?: string; // can get rid of
    phone?: string; // i used phoneNumber in newPatient.tsx so maybe get rid of this or replace it idk
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

  // models/patient.ts

  const PatientSchema = new Schema<IPatient>({
    patientId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    age: { type: Number },
    location: { type: String, required: true },
    language: { type: String },
    chiefComplaint: { type: String, required: true },
    laterality: { type: String, enum: ['Not Selected', 'Left', 'Right', 'Bilateral'], default: 'Not Selected' },
    diagnosis: { type: String },
    diagnosisCat: { type: String },
    hospital: { type: String, enum: ['Not Selected', 'PMC', 'PRCS', 'Hugo Chavez'], default: 'Not Selected' },
    priority: { type: String, enum: ['Not Selected', 'Routine', 'Moderate', 'Urgent', 'Emergency'], default: 'Not Selected' },
    specialty: { type: String, enum: SPECIALTIES },
    status: { type: String, enum: ['Not Selected', 'Not Started', 'Triaged', 'In-Progress', 'Completed'], default: 'Not Started' },
    icd10: { type: String },
    surgeryDate: { type: Date },
    occupation: { type: String },
    baselineAmbu: { type: String, enum: ['Not Selected', 'Independent', 'Boot', 'Crutches', 'Walker', 'Non-Ambulatory'], default: 'Not Selected' },
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
    files: [{ type: Object }],
  });
  const Patient = models.Patient || model<IPatient>('Patient', PatientSchema);

  export default Patient;