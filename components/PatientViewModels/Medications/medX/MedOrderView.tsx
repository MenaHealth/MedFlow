// components/form/Medications/MedOrderView.tsx
import React, {useCallback, useEffect} from 'react';
import { TextFormField } from '../../../../components/ui/TextFormField';
import { Button } from '../../../../components/ui/button';
import { usePatientDashboard } from '../../../PatientViewModels/PatientViewModelContext';
import { useMedOrderRequestViewModel } from './MedOrderViewModel';

interface MedOrderViewProps {
    patientId: string;
}

export default function MedOrderView({ patientId }: MedOrderViewProps) {
    const { userSession, patientViewModel } = usePatientDashboard();
    const { medOrder, isLoading, isReadOnly, handleInputChange, submitMedOrder } = useMedOrderRequestViewModel(patientId);

    const primaryDetails = patientViewModel?.getPrimaryDetails();
    const expandedDetails = patientViewModel?.getExpandedDetails();

    // Memoize handleInputChange to prevent redefinition on each render
    const memoizedHandleInputChange = useCallback(handleInputChange, [handleInputChange]);

    useEffect(() => {
        if (userSession && primaryDetails && expandedDetails) {
            // Only update the state if the values are different from the current ones
            if (userSession.doctorSpecialty !== medOrder.doctorSpecialty) {
                memoizedHandleInputChange('doctorSpecialty', userSession.doctorSpecialty || '');
            }
            if (primaryDetails.patientName !== medOrder.patientName) {
                memoizedHandleInputChange('patientName', primaryDetails.patientName || '');
            }
            if (expandedDetails.phone !== medOrder.phoneNumber) {
                memoizedHandleInputChange('phoneNumber', expandedDetails.phone || '');
            }
        }
    }, [userSession, primaryDetails, expandedDetails, medOrder, memoizedHandleInputChange]);

    return (
        <div className="space-y-4">
            {isLoading && <div className="loading-spinner">Loading...</div>}

            <TextFormField
                fieldName="doctorInCharge"
                fieldLabel="Doctor in Charge"
                value={`${userSession?.firstName || ''} ${userSession?.lastName || ''}`}
                readOnly={true}
            />
            <TextFormField
                fieldName="doctorSpecialty"
                fieldLabel="Doctor Specialty"
                value={userSession?.doctorSpecialty || ''}
                readOnly={true}
            />

            <TextFormField
                fieldName="patientName"
                fieldLabel="Patient's Full Name"
                value={medOrder.patientName}
                readOnly={true}
            />
            <TextFormField
                fieldName="phoneNumber"
                fieldLabel="Phone Number"
                value={medOrder.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
            <TextFormField
                fieldName="address"
                fieldLabel="address"
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

                <Button onClick={submitMedOrder} disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit Medical Order'}
                </Button>
        </div>
    );
}