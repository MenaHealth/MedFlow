// components/form/Medications/MedicalOrderRequestView.tsx
import React from 'react';
import { TextFormField } from '@/components/ui/TextFormField';
import { SingleChoiceFormField } from '@/components/form/SingleChoiceFormField';
import { DoctorSpecialties } from '@/data/doctorSpecialty.enum';
import { IMedX } from '@/models/MedX';
import { useFormContext } from 'react-hook-form';

interface MedicalOrderRequestViewProps {
    medicalOrder: IMedX['content'];
    onChange: (name: string, value: string) => void;
}

export default function MedicalOrderRequestView({ medicalOrder, onChange }: MedicalOrderRequestViewProps) {
    const { register } = useFormContext();

    return (
        <div className="space-y-4">
            <SingleChoiceFormField
                fieldName="medicalOrder.doctorSpecialty"
                fieldLabel="Doctor Specialty"
                choices={DoctorSpecialties}
                value={medicalOrder.doctorSpecialty}
                onChange={(value) => onChange('doctorSpecialty', value)}
            />
            <TextFormField
                fieldName="medicalOrder.patientName"
                fieldLabel="Patient's Full Name"
                {...register('medicalOrder.patientName')}
            />
            <TextFormField
                fieldName="medicalOrder.patientPhoneNumber"
                fieldLabel="Patient's Phone Number"
                {...register('medicalOrder.patientPhoneNumber')}
            />
            <TextFormField
                fieldName="medicalOrder.patientAddress"
                fieldLabel="Patient's Address"
                {...register('medicalOrder.patientAddress')}
            />
            <TextFormField
                fieldName="medicalOrder.diagnosis"
                fieldLabel="Diagnosis"
                {...register('medicalOrder.diagnosis')}
                multiline
                rows={2}
            />
            <TextFormField
                fieldName="medicalOrder.medications"
                fieldLabel="Medications"
                {...register('medicalOrder.medications')}
                multiline
                rows={2}
            />
            <TextFormField
                fieldName="medicalOrder.dosage"
                fieldLabel="Dosage"
                {...register('medicalOrder.dosage')}
                multiline
                rows={2}
            />
            <TextFormField
                fieldName="medicalOrder.frequency"
                fieldLabel="Frequency/Duration"
                {...register('medicalOrder.frequency')}
                multiline
                rows={2}
            />
        </div>
    );
}