// components/form/Medications/MedicalOrderRequestViewModel.ts
import { useState } from 'react';
import { MedicalOrderRequest } from '@/models/MedicalOrderRequest';
import { Session } from 'next-auth';

export function useMedicalOrderRequestViewModel(user: Session['user'], patientId: string) {
    const [medicalOrderRequest, setMedicalOrderRequest] = useState<MedicalOrderRequest>({
        date: new Date().toISOString().split('T')[0],
        drInCharge: `${user?.firstName} ${user?.lastName}`,
        specialty: '',
        patientName: '',
        patientPhoneNumber: '',
        patientAddress: '',
        diagnosis: '',
        medications: '',
        dosage: '',
        frequency: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMedicalOrderRequest({
            ...medicalOrderRequest,
            [e.target.name]: e.target.value,
        });
    };

    const publishMedicalOrderRequest = async () => {
        if (!user) {
            console.error('User profile not found.');
            return;
        }

        try {
            const response = await fetch(`/api/patient/medicalrequests/${patientId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...medicalOrderRequest,
                    createdBy: {
                        userId: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                    },
                    createdAt: new Date(),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedPatient = await response.json();
            // You might want to update some state here or trigger a refresh of the notes2 list
        } catch (error) {
            console.error('Failed to publish Medical Order Request:', error);
        }
    };

    return { medicalOrderRequest, handleInputChange, publishMedicalOrderRequest };
}