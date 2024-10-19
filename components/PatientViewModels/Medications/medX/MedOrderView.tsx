// components/form/Medications/MedOrderView.tsx
import React from 'react';
import { TextFormField } from '@/components/ui/TextFormField';
import { SingleChoiceFormField } from '@/components/form/SingleChoiceFormField';
import { DoctorSpecialties } from '@/data/doctorSpecialty.enum';
import { useFormContext } from 'react-hook-form';
import ReadOnlyField from "../../../form/ReadOnlyField";
import { Button } from '@/components/ui/button';

interface MedicalOrderRequestViewProps {
    medicalOrder: any;
    isLoading: boolean;
    isReadOnly: boolean;
    onChange: (name: string, value: string) => void;
    onSubmit: () => void;
}

export default function MedOrderView({
                                         medicalOrder,
                                         isLoading,
                                         isReadOnly,
                                         onChange,
                                         onSubmit,
                                     }: MedicalOrderRequestViewProps) {
    return (
        <div className="space-y-4">
            {isLoading && <div className="loading-spinner">Loading...</div>}

            <ReadOnlyField
                fieldName="doctorSpecialty"
                fieldLabel="Doctor Specialty"
                value={medicalOrder.doctorSpecialty}
            />

            {isReadOnly ? (
                <>
                    <ReadOnlyField fieldName="patientName" fieldLabel="Patient's Full Name" value={medicalOrder.patientName} />
                    <ReadOnlyField fieldName="patientPhoneNumber" fieldLabel="Patient's Phone Number" value={medicalOrder.patientPhoneNumber} />
                    <ReadOnlyField fieldName="patientAddress" fieldLabel="Patient's Address" value={medicalOrder.patientAddress} />
                    <ReadOnlyField fieldName="diagnosis" fieldLabel="Diagnosis" value={medicalOrder.diagnosis} />
                    <ReadOnlyField fieldName="medications" fieldLabel="Medications" value={medicalOrder.medications} />
                    <ReadOnlyField fieldName="dosage" fieldLabel="Dosage" value={medicalOrder.dosage} />
                    <ReadOnlyField fieldName="frequency" fieldLabel="Frequency/Duration" value={medicalOrder.frequency} />
                </>
            ) : (
                <>
                    <TextFormField
                        fieldName="patientName"
                        fieldLabel="Patient's Full Name"
                        value={medicalOrder.patientName}
                        onChange={(e) => onChange('patientName', e.target.value)}
                    />
                    <TextFormField
                        fieldName="patientPhoneNumber"
                        fieldLabel="Patient's Phone Number"
                        value={medicalOrder.patientPhoneNumber}
                        onChange={(e) => onChange('patientPhoneNumber', e.target.value)}
                    />
                    <TextFormField
                        fieldName="patientAddress"
                        fieldLabel="Patient's Address"
                        value={medicalOrder.patientAddress}
                        onChange={(e) => onChange('patientAddress', e.target.value)}
                    />
                    <TextFormField
                        fieldName="diagnosis"
                        fieldLabel="Diagnosis"
                        value={medicalOrder.diagnosis}
                        onChange={(e) => onChange('diagnosis', e.target.value)}
                        multiline
                        rows={2}
                    />
                    <TextFormField
                        fieldName="medications"
                        fieldLabel="Medications"
                        value={medicalOrder.medications}
                        onChange={(e) => onChange('medications', e.target.value)}
                        multiline
                        rows={2}
                    />
                    <TextFormField
                        fieldName="dosage"
                        fieldLabel="Dosage"
                        value={medicalOrder.dosage}
                        onChange={(e) => onChange('dosage', e.target.value)}
                        multiline
                        rows={2}
                    />
                    <TextFormField
                        fieldName="frequency"
                        fieldLabel="Frequency/Duration"
                        value={medicalOrder.frequency}
                        onChange={(e) => onChange('frequency', e.target.value)}
                        multiline
                        rows={2}
                    />
                </>
            )}

            {!isReadOnly && (
                <Button onClick={onSubmit} disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit Medical Order'}
                </Button>
            )}
        </div>
    );
}