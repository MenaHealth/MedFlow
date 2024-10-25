// components/form/Medications/MedOrderViewModel.ts

import { useState } from 'react';
import { usePatientDashboard } from './../../../../components/PatientViewModels/PatientViewModelContext';
import { DoctorSpecialtyList } from './../../../../data/doctorSpecialty.enum';

interface Medication {
    medication: string;
    dosage: string;
    frequency: string;
}

interface MedOrder {
    doctorSpecialty: keyof typeof DoctorSpecialtyList;
    doctorId: string;
    patientName: string;
    city: string;
    medications: Medication[];
}

export function useMedOrderRequestViewModel(patientId: string, patientName: string, city: string) {
    const { userSession } = usePatientDashboard();

    const [medOrder, setMedOrder] = useState<MedOrder>({
        patientName,
        city,
        medications: [{ medication: '', dosage: '', frequency: '' }],
        doctorSpecialty: userSession?.doctorSpecialty as keyof typeof DoctorSpecialtyList || DoctorSpecialtyList.NOT_SELECTED,
        doctorId: userSession?.id || '',
    });

    const [previousMedOrders, setPreviousMedOrders] = useState<MedOrder[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: keyof MedOrder, value: any) => {
        setMedOrder((prevOrder) => ({
            ...prevOrder,
            [field]: value,
        }));
    };

    const submitMedOrder = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/med-orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userSession?.email,
                    authorName: `${userSession?.firstName} ${userSession?.lastName}`,
                    authorID: userSession?.id,
                    content: medOrder,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit med order');
            }

            const newMedOrder = await response.json();
            setPreviousMedOrders((prevOrders) => [...prevOrders, newMedOrder]);
            setMedOrder({
                patientName: '',
                city: '',
                medications: [{ medication: '', dosage: '', frequency: '' }],
                doctorSpecialty: userSession?.doctorSpecialty as keyof typeof DoctorSpecialtyList || DoctorSpecialtyList.NOT_SELECTED,
                doctorId: userSession?.id || '',
            });
        } catch (error) {
            console.error('Failed to submit med order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { medOrder, submitMedOrder, previousMedOrders, isLoading, handleInputChange };
}