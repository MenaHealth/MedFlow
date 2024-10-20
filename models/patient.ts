  // models/patient.ts
  import { Schema, model, models, Document, Types } from 'mongoose';
  import { DoctorSpecialties as SPECIALTIES } from '@/data/doctorSpecialty.enum';

  interface Prescription {
    medName: string;
    medDosage: string;
    medFrequency: string;
  }

  export interface IPatient extends Document {
    files?: any[];
    _id?: string;
    firstName: string;
    lastName: string;
    phone: string;
    age?: string;
    country?: string;
    city?: string;
    language?: string;
    genderPreference?: string;
    previouslyRegistered?: string;
    chiefComplaint?: string;
    coordinatorId?: string;
    email?: string;
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
    medx?: Prescription[];
    smokeCount?: string;
    drinkCount?: string;
    otherDrugs?: string;
    allergies?: string;
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
    notes?: string;
    visits?: Types.ObjectId[];
    createdAt?: Date; // Add timestamp field for creation
    updatedAt?: Date; // Add timestamp field for last update
  }

  // models/patient.ts

  const PatientSchema = new Schema<IPatient>({
    files: [{ type: Object }],
    firstName: { type: String, required: true },
    lastName: { type: String },
    phone: { type: String },
    age: { type: String },
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
    triagedBy: { type: Object },
    doctor: { type: Object },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
  });

  const Patient = models.Patient || model<IPatient>('Patient', PatientSchema);

  export default Patient;
