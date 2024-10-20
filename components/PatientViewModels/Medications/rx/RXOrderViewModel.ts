import { useState, useEffect } from 'react';
import RxOrders from '../../../../models/rxOrders';
import { usePatientDashboard } from '@/components/PatientViewModels/PatientViewModelContext';

export function useRXOrderViewModel(patientId: string) {
    const { userSession } = usePatientDashboard();
    const [rxForm, setRxForm] = useState<RxOrders>({
        patientName: '',
        phoneNumber: '',
        referringDr: '',
        prescribingDr: '',
        age: '',
        address: '',
        diagnosis: '',
        medicationsNeeded: '',
        pharmacyOrClinic: '',
        medication: '',
        dosage: '',
        frequency: '',
    });

    const [previousrxOrders, setPreviousrxOrders] = useState<RxOrders[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const SumbitRxOrder = async (formData: RxOrders) => {
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
                    content: formData,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to publish RX form');
            }

            const newRXForm = await response.json();
            setPreviousrxOrders(prevForms => [...prevForms, newRXForm]);
            setRxForm({
                patientName: '',
                phoneNumber: '',
                referringDr: '',
                prescribingDr: '',
                age: '',
                address: '',
                diagnosis: '',
                medicationsNeeded: '',
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

    return { rxForm, SumbitRxOrder, previousrxOrders, isLoading };
}