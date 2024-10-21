import React, { useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '../../../../components/ui/button';
import { TextFormField } from '../../../../components/ui/TextFormField';
import { SingleChoiceFormField } from '../../../../components/form/SingleChoiceFormField';
import { Pharmacies } from '../../../../data/pharmacies.enum';
import { usePatientDashboard } from '../../../../components/PatientViewModels/PatientViewModelContext';
import { useRXOrderViewModel } from '../../../../components/PatientViewModels/Medications/rx/RXOrderViewModel';

interface RXOrderViewProps {
    patientId: string;
}

export default function RXOrderView({ patientId }: RXOrderViewProps) {
    const { handleSubmit } = useFormContext();  // Use form context
    const { SubmitRxOrder, isLoading, rxOrder, handleInputChange } = useRXOrderViewModel(patientId);
    const { userSession, patientViewModel } = usePatientDashboard();

    const primaryDetails = patientViewModel?.getPrimaryDetails();
    const expandedDetails = patientViewModel?.getExpandedDetails();

    // Memoize handleInputChange to prevent redefinition on each render
    const memoizedHandleInputChange = useCallback(handleInputChange, [handleInputChange]);

    useEffect(() => {
        if (userSession && primaryDetails && expandedDetails) {
            // Populate form with user and patient info if not already filled
            if (userSession.doctorSpecialty !== rxOrder.prescribingDr) {
                memoizedHandleInputChange('prescribingDr', userSession.doctorSpecialty || '');
            }
            if (primaryDetails.patientName !== rxOrder.patientName) {
                memoizedHandleInputChange('patientName', primaryDetails.patientName || '');
            }
            if (expandedDetails.phone !== rxOrder.phoneNumber) {
                memoizedHandleInputChange('phoneNumber', expandedDetails.phone || '');
            }
            if (expandedDetails.age !== rxOrder.age) {
                memoizedHandleInputChange('age', expandedDetails.age || '');
            }
        }
    }, [userSession, primaryDetails, expandedDetails, rxOrder, memoizedHandleInputChange]);

    // Handle the form submission
    const onSubmit = async (data: any) => {
        await SubmitRxOrder(data);  // Submit RX order here
    };

    return (
        <div className="space-y-4">
            <TextFormField
                fieldName="doctorInCharge"
                fieldLabel="Doctor in Charge"
                value={`${userSession?.firstName || ''} ${userSession?.lastName || ''}`}
                readOnly={true}
            />
            <TextFormField
                fieldName="prescribingDr"
                fieldLabel="Prescribing Doctor"
                value={userSession?.doctorSpecialty || ''}
                readOnly={true}
            />

            <TextFormField
                fieldName="patientName"
                fieldLabel="Patient's Full Name"
                value={rxOrder.patientName}
                readOnly={true}
            />
            <TextFormField
                fieldName="phoneNumber"
                fieldLabel="{Patient Phone Number"
                value={rxOrder.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                readOnly={true}
            />
            <TextFormField
                fieldName="age"
                fieldLabel="Age"
                value={rxOrder.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
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

            {/* Submit Button */}
            <Button
                type="submit"
                variant="submit"
                className="mt-4"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
            >
                {isLoading ? 'Saving...' : 'Submit RX Order'}
            </Button>
        </div>
    );
}