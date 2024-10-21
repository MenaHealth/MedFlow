// components/form/Medications/MedOrderView.tsx
import React from 'react';
import { TextFormField } from '../../../../components/ui/TextFormField';
import { Button } from '../../../../components/ui/button';
import { useMedOrderRequestViewModel } from './MedOrderViewModel';

interface User {
    firstName: string;
    lastName: string;
    doctorSpecialty: string;
}

interface PatientDetails {
    patientName: string;
}

interface ExpandedDetails {
    phone: string;
}

// Update the MedOrderViewProps interface to use the new types
interface MedOrderViewProps {
    user: User;
    patientId: string;
    patientDetails: PatientDetails;
    expandedDetails: ExpandedDetails;
}

export default function MedOrderView({ patientId, user, patientDetails, expandedDetails }: MedOrderViewProps) {
    const { medOrder, isLoading, isReadOnly, handleInputChange, submitMedOrder } = useMedOrderRequestViewModel(patientId);

    // Use the props directly to populate the form fields
    return (
        <div className="space-y-4">
            {isLoading && <div className="loading-spinner">Loading...</div>}

            <TextFormField
                fieldName="doctorInCharge"
                fieldLabel="Doctor in Charge"
                value={`${user.firstName} ${user.lastName}`}
                readOnly={true}
            />
            <TextFormField
                fieldName="doctorSpecialty"
                fieldLabel="Doctor Specialty"
                value={user.doctorSpecialty}
                readOnly={true}
            />
            <TextFormField
                fieldName="patientName"
                fieldLabel="Patient's Full Name"
                value={patientDetails.patientName}
                readOnly={true}
            />
            <TextFormField
                fieldName="phoneNumber"
                fieldLabel="Phone Number"
                value={expandedDetails.phone}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
            <TextFormField
                fieldName="address"
                fieldLabel="Address"
                value={medOrder.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
            />
            <TextFormField
                fieldName="diagnosis"
                fieldLabel="Diagnosis"
                value={medOrder.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
            />
            <TextFormField
                fieldName="medications"
                fieldLabel="Medications"
                value={medOrder.medications}
                onChange={(e) => handleInputChange('medications', e.target.value)}
            />
            <TextFormField
                fieldName="dosage"
                fieldLabel="Dosage"
                value={medOrder.dosage}
                onChange={(e) => handleInputChange('dosage', e.target.value)}
            />
            <TextFormField
                fieldName="frequency"
                fieldLabel="Frequency/Duration"
                value={medOrder.frequency}
                onChange={(e) => handleInputChange('frequency', e.target.value)}
            />

            <Button onClick={submitMedOrder} disabled={isLoading} variant="submit">
                {isLoading ? 'Submitting...' : 'Submit Medical Order'}
            </Button>
        </div>
    );
}