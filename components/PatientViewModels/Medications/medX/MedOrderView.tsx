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
            if (userSession.doctorSpecialty !== medOrder.content.doctorSpecialty) {
                memoizedHandleInputChange('doctorSpecialty', userSession.doctorSpecialty || '');
            }
            if (primaryDetails.patientName !== medOrder.content.patientName) {
                memoizedHandleInputChange('patientName', primaryDetails.patientName || '');
            }
            if (expandedDetails.phone !== medOrder.content.patientPhoneNumber) {
                memoizedHandleInputChange('patientPhoneNumber', expandedDetails.phone || '');
            }
        }
    }, [userSession, primaryDetails, expandedDetails, medOrder.content, memoizedHandleInputChange]);

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
                value={medOrder.content.patientName}
                readOnly={true}
            />
            <TextFormField
                fieldName="patientPhoneNumber"
                fieldLabel="Patient's Phone Number"
                value={medOrder.content.patientPhoneNumber}
                readOnly={true}
            />
            <TextFormField
                fieldName="patientAddress"
                fieldLabel="Patient's Address"
                value={medOrder.content.patientAddress}
                onChange={(e) => handleInputChange('patientAddress', e.target.value)}
                readOnly={isReadOnly}
            />
            <TextFormField
                fieldName="diagnosis"
                fieldLabel="Diagnosis"
                value={medOrder.content.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                readOnly={isReadOnly}
            />
            <TextFormField
                fieldName="medications"
                fieldLabel="Medications"
                value={medOrder.content.medications}
                onChange={(e) => handleInputChange('medications', e.target.value)}
                readOnly={isReadOnly}
            />
            <TextFormField
                fieldName="dosage"
                fieldLabel="Dosage"
                value={medOrder.content.dosage}
                onChange={(e) => handleInputChange('dosage', e.target.value)}
                readOnly={isReadOnly}
            />
            <TextFormField
                fieldName="frequency"
                fieldLabel="Frequency/Duration"
                value={medOrder.content.frequency}
                onChange={(e) => handleInputChange('frequency', e.target.value)}
                readOnly={isReadOnly}
            />

            {!isReadOnly && (
                <Button onClick={submitMedOrder} disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit Medical Order'}
                </Button>
            )}
        </div>
    );
}