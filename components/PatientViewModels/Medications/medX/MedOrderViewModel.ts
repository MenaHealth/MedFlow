// components/form/Medications/MedOrderViewModel.ts
import { useState } from 'react';

export function useMedOrderRequestViewModel(patientId: string) {
    const [medicalOrder, setMedicalOrder] = useState({
        doctorSpecialty: '',
        patientName: '',
        patientPhoneNumber: '',
        patientAddress: '',
        diagnosis: '',
        medications: '',
        dosage: '',
        frequency: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);

    const handleInputChange = (name: string, value: string) => {
        setMedicalOrder({
            ...medicalOrder,
            [name]: value,
        });
    };

    const submitMedicalOrder = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/patient/${patientId}/medications/med-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    doctorSpecialty: medicalOrder.doctorSpecialty,
                    patientName: medicalOrder.patientName,
                    patientPhoneNumber: medicalOrder.patientPhoneNumber,
                    patientAddress: medicalOrder.patientAddress,
                    diagnosis: medicalOrder.diagnosis,
                    medications: medicalOrder.medications,
                    dosage: medicalOrder.dosage,
                    frequency: medicalOrder.frequency,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit medical order');
            }

            // Mark the form as read-only on success
            setIsReadOnly(true);
        } catch (error) {
            console.error('Error submitting medical order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        medicalOrder,
        isLoading,
        isReadOnly,
        handleInputChange,
        submitMedicalOrder,
    };
}