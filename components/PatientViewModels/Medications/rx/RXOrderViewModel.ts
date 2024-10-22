import { useState } from 'react';
import { usePatientDashboard } from './../../../../components/PatientViewModels/PatientViewModelContext';
import { DoctorSpecialtyList } from './../../../../data/doctorSpecialty.enum';

interface Prescription {
    medication: string;
    dosage: string;
    frequency: string;
}

interface RxOrder {
    patientName: string;
    phoneNumber: string;
    age: string;
    doctorSpecialization: keyof typeof DoctorSpecialtyList;
    diagnosis: string;
    pharmacyOrClinic: string;
    prescriptions: Prescription[];
}

export function useRXOrderViewModel(patientId: string, patientName: string, phoneNumber: string, age: string) {
    const { userSession } = usePatientDashboard();

    const [rxOrder, setrxOrder] = useState<RxOrder>({
        patientName,
        phoneNumber,
        age,
        doctorSpecialization: userSession?.doctorSpecialty as keyof typeof DoctorSpecialtyList || DoctorSpecialtyList.NOT_SELECTED,
        diagnosis: '',
        pharmacyOrClinic: '',
        prescriptions: [{ medication: '', dosage: '', frequency: '' }]
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string, value: any) => {
        setrxOrder((prevOrder) => {
            if (field.includes('.')) {
                const [parentField, childField] = field.split('.');
                return {
                    ...prevOrder,
                    [parentField]: {
                        ...prevOrder[parentField as keyof RxOrder],
                        [childField]: value
                    }
                };
            }
            return {
                ...prevOrder,
                [field]: value,
            };
        });
    };

    const submitRxOrder = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/patient/${patientId}/medications/rx-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userSession?.email,
                    date: new Date().toISOString(),
                    authorName: `${userSession?.firstName} ${userSession?.lastName}`,
                    authorID: userSession?.id,
                    content: rxOrder,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to publish RX form');
            }

            const newRxOrder = await response.json();
            // Handle successful submission (e.g., show success message, reset form, etc.)

            // Reset the form
            setrxOrder({
                patientName: '',
                phoneNumber: '',
                age: '',
                doctorSpecialization: userSession?.doctorSpecialty as keyof typeof DoctorSpecialtyList || DoctorSpecialtyList.NOT_SELECTED,
                diagnosis: '',
                pharmacyOrClinic: '',
                prescriptions: [{ medication: '', dosage: '', frequency: '' }],
            });
        } catch (error) {
            console.error('Failed to publish RX form:', error);
            // Handle error (e.g., show error message)
        } finally {
            setIsLoading(false);
        }
    };

    return { rxOrder, submitRxOrder, isLoading, handleInputChange };
}