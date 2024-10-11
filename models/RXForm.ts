// models/RXForm.ts
import { Pharmacy } from '@/data/pharmacies.enum';

export interface RXForm {
    patientName: string;
    phoneNumber: Number | string;
    age: Date | string;
    address: string;
    patientID: string;
    date: Date | string;
    referringDr: string;
    prescribingDr: string;
    diagnosis: string;
    medicationsNeeded: string;
    pharmacyOrClinic: string;
    medication: string;
    dosage: string;
    frequency: string;
}