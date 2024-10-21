    // components/form/Medications/MedOrderViewModel.ts


    import { useState } from 'react';
    import { usePatientDashboard } from '@/components/PatientViewModels/PatientViewModelContext';

    interface MedOrder {
        patientName: string;
        phoneNumber: string;
        address: string;
        diagnosis: string;
        medications: string;
        dosage: string;
        frequency: string;
        doctorSpecialty: string;
    }

    export function useMedOrderRequestViewModel(patientId: string) {
        const { userSession } = usePatientDashboard();

        const [medOrder, setMedOrder] = useState<MedOrder>({
            patientName: '',
            phoneNumber: '',
            address: '',
            diagnosis: '',
            medications: '',
            dosage: '',
            frequency: '',
            doctorSpecialty: ''
        });

        const [previousMedOrders, setPreviousMedOrders] = useState<MedOrder[]>([]); // Explicitly type the state as an array of MedOrder objects
        const [isLoading, setIsLoading] = useState(false);
        const [isReadOnly] = useState(true);

        const handleInputChange = (field: keyof MedOrder, value: string) => {
            setMedOrder((prevOrder) => ({
                ...prevOrder,
                [field]: value,
            }));
        };

        const submitMedOrder = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/patient/${patientId}/medications/med-order`, {
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
                setPreviousMedOrders(prevForms => [...prevForms, newMedOrder]); // Type now matches
                setMedOrder({
                    patientName: '',
                    phoneNumber: '',
                    address: '',
                    diagnosis: '',
                    medications: '',
                    dosage: '',
                    frequency: '',
                    doctorSpecialty: ''
                });
            } catch (error) {
                console.error('Failed to submit med order:', error);
            } finally {
                setIsLoading(false);
            }
        };

        return { medOrder, submitMedOrder, previousMedOrders, isLoading, isReadOnly, handleInputChange };
    }