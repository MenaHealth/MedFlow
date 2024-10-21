import { useState } from 'react';
import { usePatientDashboard } from './../../../../components/PatientViewModels/PatientViewModelContext';

// Define an interface for RXOrder
interface RxOrder {
    patientName: string;
    phoneNumber: string;
    referringDr: string;
    prescribingDr: string;
    age: string;
    address: string;
    diagnosis: string;
    pharmacyOrClinic: string;
    medication: string;
    dosage: string;
    frequency: string;
}

export function useRXOrderViewModel(patientId: string) {
    const { userSession } = usePatientDashboard();

    // Type the state as RxOrder
    const [rxOrder, setrxOrder] = useState<RxOrder>({
        patientName: '',
        phoneNumber: '',
        referringDr: '',
        prescribingDr: '',
        age: '',
        address: '',
        diagnosis: '',
        pharmacyOrClinic: '',
        medication: '',
        dosage: '',
        frequency: '',
    });

    // Type the previousrxOrders state as an array of RxOrder
    const [previousrxOrders, setPreviousrxOrders] = useState<RxOrder[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isReadOnly] = useState(true);

    // Handle input changes
    const handleInputChange = (field: keyof RxOrder, value: string) => {
        setrxOrder((prevOrder) => ({
            ...prevOrder,
            [field]: value,
        }));
    };

    // Accept formData as RxOrder type instead of 'any'
    const submitRxOrder = async (formData: RxOrder) => {
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
                    content: formData,  // Ensure formData follows RxOrder structure
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to publish RX form');
            }

            const newrxOrder = await response.json();
            setPreviousrxOrders(prevForms => [...prevForms, newrxOrder]);

            // Reset the form
            setrxOrder({
                patientName: '',
                phoneNumber: '',
                referringDr: '',
                prescribingDr: '',
                age: '',
                address: '',
                diagnosis: '',
                pharmacyOrClinic: '',
                medication: '',
                dosage: '',
                frequency: '',
            });
        } catch (error) {
            console.error('Failed to publish RX form:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { rxOrder, submitRxOrder, previousrxOrders, isLoading, isReadOnly, handleInputChange };
}