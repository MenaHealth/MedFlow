import { useCallback, useState, useMemo } from 'react';
import { usePatientDashboard } from '@/components/PatientViewModels/PatientViewModelContext';
import { IRxOrder } from "@/models/patient";

interface Prescription {
    diagnosis: string;
    medication: string;
    dosage: string;
    frequency: string;
}

export function useRXOrderViewModel(
    patientId: string,
    onNewRxOrderSaved: (rxOrder: IRxOrder) => void,
    city: string
) {
    const { userSession, refreshMedications, addRxOrder } = usePatientDashboard();
    const [rxOrder, setRxOrder] = useState<IRxOrder>({
        doctorSpecialty: userSession?.doctorSpecialty || 'Not Selected',
        prescribingDr: `${userSession?.firstName} ${userSession?.lastName}`,
        drEmail: userSession?.email || '',
        drId: userSession?.id || '',
        prescribedDate: new Date(),
        validTill: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        city,
        validated: false,
        prescriptions: [{ diagnosis: '', medication: '', dosage: '', frequency: '' }],
    });
    const [isLoading, setIsLoading] = useState(false);

    const isFormComplete = useMemo(() => {
        return rxOrder.prescriptions.every(prescription =>
            prescription.diagnosis &&
            prescription.medication &&
            prescription.dosage &&
            prescription.frequency
        );
    }, [rxOrder.prescriptions]);

    const handleInputChange = (field: keyof IRxOrder, value: any) => {
        setRxOrder(prevOrder => ({
            ...prevOrder,
            [field]: value,
        }));
    };

    const handlePrescriptionChange = (index: number, field: keyof Prescription, value: string) => {
        setRxOrder(prevOrder => {
            const newPrescriptions = [...prevOrder.prescriptions];
            newPrescriptions[index] = { ...newPrescriptions[index], [field]: value };

            return {
                ...prevOrder,
                prescriptions: newPrescriptions,
            };
        });
    };

    const addPrescription = () => {
        setRxOrder(prevOrder => ({
            ...prevOrder,
            prescriptions: [
                ...prevOrder.prescriptions,
                { diagnosis: '', medication: '', dosage: '', frequency: '' }
            ],
        }));
    };

    const removePrescription = (index: number) => {
        setRxOrder(prevOrder => ({
            ...prevOrder,
            prescriptions: prevOrder.prescriptions.filter((_, i) => i !== index),
        }));
    };

    const submitRxOrder = useCallback(async () => {
        console.log("Submit button clicked - starting RX order submission");

        if (!isFormComplete) {
            console.warn("Form incomplete - not submitting RX order.");
            return;
        }

        console.log("submitRxOrder is being called with data:", rxOrder);
        setIsLoading(true);

        try {
            const response = await fetch(`/api/patient/${patientId}/medications/rx-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rxOrder),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save RX order: ${errorText}`);
            }

            const savedRxOrder = await response.json();
            addRxOrder(savedRxOrder);
            await refreshMedications();
            onNewRxOrderSaved(savedRxOrder);

            // Reset form after saving
            setRxOrder({
                ...rxOrder,
                prescribedDate: new Date(),
                validTill: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                prescriptions: [{ diagnosis: '', medication: '', dosage: '', frequency: '' }],
            });
        } catch (error) {
            console.error('Failed to save RX order:', error);
        } finally {
            setIsLoading(false);
        }
    }, [rxOrder, patientId, addRxOrder, refreshMedications, onNewRxOrderSaved, isFormComplete]);

    return {
        rxOrder,
        setRxOrder,
        submitRxOrder,
        isLoading,
        isFormComplete,
        handleInputChange,
        handlePrescriptionChange,
        addPrescription,
        removePrescription,
    };
}