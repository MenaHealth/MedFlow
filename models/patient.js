import { Schema, model, models } from 'mongoose';
import { CLINICS, PATIENT_STATUSES } from '@/data/data';

const PatientSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required!'],
  },
  birthDate: {
    type: Date,
  },
  location: {
    type: String,
  },
  govtId: {
    type: String,
  },
  complaint: {
    type: String,
  },
  contactNo: {
    type: String,
  },

  // MedFlow specific fields
  status: {
    type: String,
    default: 'New',
    enum: PATIENT_STATUSES,
  },
  coordinatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedClinic: {
    type: String,
    enum: CLINICS,
  },
  assignedDocId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  admittedDate: {
    type: Date,
  },
});

const Patient = models.Patient || model('Patient', PatientSchema);

export default Patient;