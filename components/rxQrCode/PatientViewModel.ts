// components/rxQrCode/PatientViewModel.ts

import { useState, useEffect } from 'react';
import { IRxOrder } from '@/models/patient';

interface RxOrderWithPatient extends IRxOrder {
    patientName: string;
    patientDob: string;
    patientCountry: string;
    patientCity: string;
}

export function usePatientViewModel(uuid: string) {
    const [rxOrder, setRxOrder] = useState<RxOrderWithPatient | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRxOrder = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/rx-order-qr-code/patient/${uuid}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch RX order');
                }
                const data = await response.json();
                console.log('Patient RX Order Data:', data);
                setRxOrder(data);
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRxOrder();
    }, [uuid]);

    return { rxOrder, loading, error };
}

export const prescriptionColumns = [
    { key: 'medication', header: 'Medication' },
    { key: 'dosage', header: 'Dosage' },
    { key: 'frequency', header: 'Frequency' },
];

