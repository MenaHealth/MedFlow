// components/patient-dashboard/patient-info/PatientInfoViewModel.tsx
import { IPatient } from './../../../models/patient';

export class PatientInfoViewModel {
    patient: IPatient | null = null;

    constructor(patientData: IPatient) {
        this.patient = patientData;
    }

    getPrimaryDetails() {
        return {
            patientName: `${this.patient?.firstName} ${this.patient?.lastName}`,
            age: this.patient?.age,
            genderPreference: this.patient?.genderPreference,
            dob: this.patient?.dob || null, // Direct access as a Date object
            patientID: this.patient?._id,
            phone: this.patient?.phone,
        };
    }

    getExpandedDetails() {
        return {
            country: this.patient?.country,
            city: this.patient?.city,
            language: this.patient?.language,
            chiefComplaint: this.patient?.chiefComplaint,
            email: this.patient?.email,
            phone: this.patient?.phone,
            diagnosis: this.patient?.diagnosis,
            diagnosisCat: this.patient?.diagnosisCat,
            hospital: this.patient?.hospital,
            priority: this.patient?.priority,
            specialty: this.patient?.specialty,
            status: this.patient?.status,
            occupation: this.patient?.occupation,
            baselineAmbu: this.patient?.baselineAmbu,
            allergies: this.patient?.allergies,
        };
    }
}