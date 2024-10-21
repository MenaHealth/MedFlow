import React, { useEffect, useCallback } from 'react';
import { TextFormField } from '../../../../components/ui/TextFormField';
import { Button } from '../../../../components/ui/button';
import { SingleChoiceFormField } from '../../../../components/form/SingleChoiceFormField';
import { Pharmacies } from '../../../../data/pharmacies.enum';
import { useRXOrderViewModel } from '../../../../components/PatientViewModels/Medications/rx/RXOrderViewModel';

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
    age: string;
}

interface RXOrderViewProps {
    user: User;
    patientId: string;
    patientDetails: PatientDetails;
    expandedDetails: ExpandedDetails;
}

export default function MedOrderView({ patientId, user, patientDetails, expandedDetails }: RXOrderViewProps) {
    const { rxOrder, isLoading, isReadOnly, handleInputChange, submitRxOrder } = useRXOrderViewModel(patientId);

    // Now use the props directly to set the field values
    return (
        <div className="space-y-4">
            <TextFormField
                fieldName="doctorInCharge"
                fieldLabel="Doctor in Charge"
                value={`${user?.firstName || ''} ${user?.lastName || ''}`}
                readOnly={true}
            />
            <TextFormField
                fieldName="prescribingDr"
                fieldLabel="Prescribing Doctor"
                value={user?.doctorSpecialty || ''}
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
                fieldLabel="Patient Phone Number"
                value={expandedDetails.phone}
                readOnly={true}
            />
            <TextFormField
                fieldName="age"
                fieldLabel="Age"
                value={expandedDetails.age}
                readOnly={true}
            />
            <TextFormField
                fieldName="address"
                fieldLabel="Address"
                value={rxOrder.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
            />
            <TextFormField
                fieldName="referringDr"
                fieldLabel="Referring Doctor"
                value={rxOrder.referringDr}
                onChange={(e) => handleInputChange('referringDr', e.target.value)}
            />
            <TextFormField
                fieldName="diagnosis"
                fieldLabel="Diagnosis"
                value={rxOrder.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
            />
            <TextFormField
                fieldName="dosage"
                fieldLabel="Dosage"
                value={rxOrder.dosage}
                onChange={(e) => handleInputChange('dosage', e.target.value)}
            />
            <TextFormField
                fieldName="frequency"
                fieldLabel="Frequency"
                value={rxOrder.frequency}
                onChange={(e) => handleInputChange('frequency', e.target.value)}
            />
            <SingleChoiceFormField
                fieldName="pharmacyOrClinic"
                fieldLabel="Pharmacy or Clinic"
                choices={[...Pharmacies]}
                value={rxOrder.pharmacyOrClinic}
                onChange={(value) => handleInputChange('pharmacyOrClinic', value)}
            />
            <TextFormField
                fieldName="medication"
                fieldLabel="Medication"
                value={rxOrder.medication}
                onChange={(e) => handleInputChange('medication', e.target.value)}
            />
            <Button
                onClick={(e) => {
                    submitRxOrder(rxOrder);
                }}
                disabled={isLoading}
                variant="submit"
            >
                {isLoading ? 'Submitting...' : 'Submit Rx Order'}
            </Button>
        </div>
    );
}