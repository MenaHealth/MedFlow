// components/patientViewModels/Medications/rx/RXOrderViewModel.ts
import {useCallback, useState, useMemo, useContext} from 'react';
import { useSession } from 'next-auth/react'; // Import the session hook
import { ToastContext } from '@/components/hooks/useToast';
import { IRxOrder } from "@/models/patient";
import { Types } from "mongoose";
import {usePatientDashboard} from "@/components/patientViewModels/PatientViewModelContext";

interface Prescription {
    diagnosis: string;
    medication: string;
    dosage: string;
    frequency: string;
}

export function useRXOrderViewModel(
    patientId: Types.ObjectId | undefined | string,
    city: string,
    patientName: string
) {
    const { data: session } = useSession();
    const { addRxOrder, refreshMedications } = usePatientDashboard();
    const { api } = useContext(ToastContext);

    const initialRxOrder = useMemo(() => ({
        doctorSpecialty: session?.user?.doctorSpecialty || 'Not Selected',
        prescribingDr: `${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`,
        drEmail: session?.user?.email || '',
        drId: session?.user?._id || '',
        prescribedDate: new Date(),
        validTill: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        city,
        prescriptions: [{ diagnosis: '', medication: '', dosage: '', frequency: '' }],
    }), [session, city]);

    const [rxOrder, setRxOrder] = useState<IRxOrder>(initialRxOrder);
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
        if (!isFormComplete) {
            return;
        }

        setIsLoading(true);

        try {
            const updatedRxOrder = {
                ...rxOrder,
                city,
                PatientRxUrl: '',
                PharmacyQrUrl: '',
                PharmacyQrCode: '',
            };

            const savedRxOrder = await api.post(`/api/patient/${patientId}/medications/rx-order`, updatedRxOrder);

            addRxOrder(savedRxOrder); // Update the context
            await refreshMedications(); // Refresh medications after adding

            // Reset form after saving
            setRxOrder({
                ...initialRxOrder,
                prescribedDate: new Date(),
                validTill: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                prescriptions: [{ diagnosis: '', medication: '', dosage: '', frequency: '' }],
            });
        } catch (error) {
            console.error('Failed to save RX order:', error);
        } finally {
            setIsLoading(false);
        }
    }, [api, rxOrder, patientId, addRxOrder, refreshMedications, isFormComplete, city, initialRxOrder]);


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