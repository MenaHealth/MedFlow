    // components/form/Medications/MedOrderViewModel.ts


    import { useState } from 'react';
    import { usePatientDashboard } from '@/components/PatientViewModels/PatientViewModelContext';

    export function useMedOrderRequestViewModel(patientId: string) {
        const { userSession } = usePatientDashboard();
        const [medOrder, setMedOrder] = useState({
            content: {
                patientName: '',
                phoneNumber: '',
                address: '',
                diagnosis: '',
                medications: '',
                dosage: '',
                frequency: '',
                patientAddress: '',
                doctorSpecialty: ''
            }
        });

        const handleInputChange = (field: string, value: string) => {
            setMedOrder(prevState => ({
                ...prevState,
                content: {
                    ...prevState.content,
                    [field]: value,
                },
            }));
        };

        const [previousMedOrders, setPreviousMedOrders] = useState([]);
        const [isLoading, setIsLoading] = useState(false);

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
                        content: medOrder.content,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to submit med order');
                }

                const newMedOrder = await response.json();
                setPreviousMedOrders(prevForms => [...prevForms, newMedOrder]);
                setMedOrder({
                    content: {
                        patientName: '',
                        phoneNumber: '',
                        address: '',
                        diagnosis: '',
                        medications: '',
                        dosage: '',
                        frequency: '',
                        patientAddress: '',
                        doctorSpecialty: '',
                    }
                });
            } catch (error) {
                console.error('Failed to submit med order:', error);
            } finally {
                setIsLoading(false);
            }
        };

        return { medOrder, submitMedOrder, previousMedOrders, isLoading, handleInputChange };
    }