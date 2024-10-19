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
            // Make API request to submit medical order
            const response = await fetch(`/api/patient/${patientId}/medications/med-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(medicalOrder),
            });

            if (!response.ok) {
                throw new Error('Failed to submit medical order');
            }

            // If successful, mark form as read-only
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