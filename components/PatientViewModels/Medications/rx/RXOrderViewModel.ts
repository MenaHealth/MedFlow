import { useState } from 'react';
import { usePatientDashboard } from '@/components/PatientViewModels/PatientViewModelContext';
import { IRxOrder } from "@/models/patient";

interface Prescription {
    diagnosis: string;
    medication: string;
    dosage: string;
    frequency: string;
}

export function useRXOrderViewModel(patientId: string, onNewRxOrderSaved: (rxOrder: IRxOrder) => void) {
    const { userSession, refreshMedications } = usePatientDashboard();

    const [rxOrder, setRxOrder] = useState<IRxOrder>({
        doctorSpecialization: userSession?.doctorSpecialty || 'Not Selected',
        prescribingDr: `${userSession?.firstName} ${userSession?.lastName}`,
        drEmail: userSession?.email || '',
        drId: userSession?.id || '',
        prescribedDate: new Date(),
        prescriptions: {
            validTill: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            city: '',
            validated: false,
            prescription: [
                { diagnosis: '', medication: '', dosage: '', frequency: '' }
            ],
        },
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: keyof IRxOrder, value: any) => {
        setRxOrder(prevOrder => ({
            ...prevOrder,
            [field]: value,
        }));
    };

    const handlePrescriptionChange = (index: number, field: keyof Prescription, value: string) => {
        setRxOrder((prevOrder) => {
            const newPrescriptions = [...prevOrder.prescriptions.prescription];
            newPrescriptions[index] = { ...newPrescriptions[index], [field]: value };

            return {
                ...prevOrder,
                prescriptions: {
                    ...prevOrder.prescriptions,
                    prescription: newPrescriptions,
                },
            };
        });
    };

    const addPrescription = () => {
        setRxOrder(prevOrder => ({
            ...prevOrder,
            prescriptions: {
                ...prevOrder.prescriptions,
                prescription: [
                    ...prevOrder.prescriptions.prescription,
                    { diagnosis: '', medication: '', dosage: '', frequency: '' }
                ],
            },
        }));
    };

    const removePrescription = (index: number) => {
        setRxOrder(prevOrder => ({
            ...prevOrder,
            prescriptions: {
                ...prevOrder.prescriptions,
                prescription: prevOrder.prescriptions.prescription.filter((_, i) => i !== index),
            },
        }));
    };

    const submitRxOrder = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/patient/${patientId}/medications/rx-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rxOrder),
            });

            if (!response.ok) throw new Error('Failed to save RX order');

            // const savedRxOrder = await response.json(); // Wait for the response to confirm save
            // onNewRxOrderSaved(savedRxOrder); // Update the UI or state with the saved RX order

            // Refresh medications only after RX order is saved
            await refreshMedications();

            // Reset RX order form
            setRxOrder(prevOrder => ({
                ...prevOrder,
                prescribedDate: new Date(),
                prescriptions: {
                    ...prevOrder.prescriptions,
                    validTill: prevOrder.prescriptions.validTill,
                    prescription: [{ diagnosis: '', medication: '', dosage: '', frequency: '' }],
                },
            }));
        } catch (error) {
            console.error('Failed to save RX order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        rxOrder,
        setRxOrder,
        submitRxOrder,
        isLoading,
        handleInputChange,
        handlePrescriptionChange,
        addPrescription,
        removePrescription,
    };
}