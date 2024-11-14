import { useCallback, useState, useMemo } from 'react';
import { usePatientDashboard } from '@/components/PatientViewModels/PatientViewModelContext';
import { IRxOrder } from "@/models/patient";
import { useToast } from '@/components/hooks/useToast';

interface Prescription {
    diagnosis: string;
    medication: string;
    dosage: string;
    frequency: string;
}

export function useRXOrderViewModel(
    patientId: string,
    onNewRxOrderSaved: (rxOrder: IRxOrder) => void,
    city: string,
    patientName: string
) {
    const { setToast } = useToast();
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

            // Create custom message for toast
            const medicationNames = rxOrder.prescriptions.map(p => p.medication);
            let toastMessage = '';
            if (medicationNames.length === 1) {
                toastMessage = `${medicationNames[0]} submitted for ${patientName}`;
            } else if (medicationNames.length === 2) {
                toastMessage = `${medicationNames[0]} and ${medicationNames[1]} submitted for ${patientName}`;
            } else if (medicationNames.length > 2) {
                const lastMed = medicationNames.pop();
                toastMessage = `${medicationNames.join(', ')}, and ${lastMed} submitted for ${patientName}`;
            }

            // Add this toast notification
            setToast({
                title: 'Rx Order Submitted',
                description: toastMessage,
                variant: 'success',
            });

            // Reset form after saving
            setRxOrder({
                ...rxOrder,
                prescribedDate: new Date(),
                validTill: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                prescriptions: [{ diagnosis: '', medication: '', dosage: '', frequency: '' }],
            });
        } catch (error) {
            console.error('Failed to save RX order:', error);
            // Add an error toast
            setToast({
                title: 'Error',
                description: 'Failed to submit Rx Order',
                variant: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    }, [rxOrder, patientId, addRxOrder, refreshMedications, onNewRxOrderSaved, isFormComplete, setToast, patientName]);

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