// components/PatientViewModels/Medications/rx/RXFormView.tsx
import React from 'react';
import { TextFormField } from '@/components/ui/TextFormField';
import { SingleChoiceFormField } from '@/components/form/SingleChoiceFormField';
import { Pharmacies } from '@/data/pharmacies.enum';
import { IRXForm } from '@/models/RXForm';

interface RXFormViewProps {
    rxForm: IRXForm['content'];
    onChange: (name: string, value: string) => void;
}

export default function RXFormView({ rxForm, onChange }: RXFormViewProps) {
    return (
        <div className="space-y-4">
            <TextFormField
                fieldName="diagnosis"
                fieldLabel="Diagnosis"
                value={rxForm.diagnosis}
                onChange={(e) => onChange('diagnosis', e.target.value)}
            />
            <TextFormField
                fieldName="medicationsNeeded"
                fieldLabel="Medications Needed"
                value={rxForm.medicationsNeeded}
                onChange={(e) => onChange('medicationsNeeded', e.target.value)}
                multiline
                rows={2}
            />
            <TextFormField
                fieldName="dosage"
                fieldLabel="Dosage"
                value={rxForm.dosage}
                onChange={(e) => onChange('dosage', e.target.value)}
            />
            <TextFormField
                fieldName="frequency"
                fieldLabel="Frequency"
                value={rxForm.frequency}
                onChange={(e) => onChange('frequency', e.target.value)}
            />
            <SingleChoiceFormField
                fieldName="pharmacyOrClinic"
                fieldLabel="Pharmacy or Clinic"
                choices={Pharmacies}
                value={rxForm.pharmacyOrClinic}
                onChange={(value) => onChange('pharmacyOrClinic', value)}
            />
            <TextFormField
                fieldName="medication"
                fieldLabel="Medication"
                value={rxForm.medication}
                onChange={(e) => onChange('medication', e.target.value)}
            />
        </div>
    );
}