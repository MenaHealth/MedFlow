// components/form/Medications/MedOrderView.tsx
import React from 'react';
import { TextFormField } from '../../../../components/ui/TextFormField';
import ReadOnlyField from "../../../form/ReadOnlyField";
import { Button } from '../../../../components/ui/button';
import { usePatientDashboard } from '../../../PatientViewModels/PatientViewModelContext'; // Import the hook to access the user session

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
    const { userSession } = usePatientDashboard(); // Access the user session

    return (
        <div className="space-y-4">
            {isLoading && <div className="loading-spinner">Loading...</div>}

            {isReadOnly ? (
                <>
                    <ReadOnlyField
                        fieldName="doctorInCharge"
                        fieldLabel="Doctor in Charge"
                        value={`${userSession?.firstName || ''} ${userSession?.lastName || ''}`} // Display doctor's name from session
                    />
                    <ReadOnlyField
                        fieldName="doctorSpecialty"
                        fieldLabel="Doctor Specialty"
                        value={userSession?.doctorSpecialty || ''} // Display doctor's specialty from session
                    />
                </>
            ) : (
                <>
                    <TextFormField
                        fieldName="patientName"
                        fieldLabel="Patient's Full Name"
                        onChange={(e) => onChange('patientName', e.target.value)}
                    />
                    <TextFormField
                        fieldName="patientPhoneNumber"
                        fieldLabel="Patient's Phone Number"
                        onChange={(e) => onChange('patientPhoneNumber', e.target.value)}
                    />
                    <TextFormField
                        fieldName="patientAddress"
                        fieldLabel="Patient's Address"
                        onChange={(e) => onChange('patientAddress', e.target.value)}
                    />
                    <TextFormField
                        fieldName="diagnosis"
                        fieldLabel="Diagnosis"
                        onChange={(e) => onChange('diagnosis', e.target.value)}
                        multiline
                        rows={2}
                    />
                    <TextFormField
                        fieldName="medications"
                        fieldLabel="Medications"
                        onChange={(e) => onChange('medications', e.target.value)}
                        multiline
                        rows={2}
                    />
                    <TextFormField
                        fieldName="dosage"
                        fieldLabel="Dosage"
                        onChange={(e) => onChange('dosage', e.target.value)}
                        multiline
                        rows={2}
                    />
                    <TextFormField
                        fieldName="frequency"
                        fieldLabel="Frequency/Duration"
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