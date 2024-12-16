<<<<<<< HEAD:components/PatientViewModels/Medications/rx/RXOrderViewModel.ts
// components/PatientViewModels/Medications/rx/RXOrderViewModel.ts
import { useContext, useCallback, useState, useMemo } from 'react';
=======
// components/patientViewModels/Medications/rx/RXOrderViewModel.ts
import {useCallback, useState, useMemo, useContext} from 'react';
import { useSession } from 'next-auth/react'; // Import the session hook
>>>>>>> main:components/patientViewModels/Medications/rx/RXOrderViewModel.ts
import { ToastContext } from '@/components/hooks/useToast';
import { IRxOrder } from "@/models/patient";
import { Types } from "mongoose";
<<<<<<< HEAD:components/PatientViewModels/Medications/rx/RXOrderViewModel.ts
=======
import {usePatientDashboard} from "@/components/patientViewModels/PatientViewModelContext";
>>>>>>> main:components/patientViewModels/Medications/rx/RXOrderViewModel.ts

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
<<<<<<< HEAD:components/PatientViewModels/Medications/rx/RXOrderViewModel.ts
        rxStatus: 'not reviewed',
    });
=======
    }), [session, city]);

    const [rxOrder, setRxOrder] = useState<IRxOrder>(initialRxOrder);
>>>>>>> main:components/patientViewModels/Medications/rx/RXOrderViewModel.ts
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
        if (!isFormComplete || !patientId) {
            console.error('Patient ID is undefined or form is incomplete');
            return;
        }

        setIsLoading(true);

        try {
<<<<<<< HEAD:components/PatientViewModels/Medications/rx/RXOrderViewModel.ts
            // Send RX order to the backend
            const response = await api.post(`/api/patient/${patientId}/medications/rx-order`, rxOrder);
            const savedRxOrder = response.data;

            // Extract the UUID from the saved RX order
            const uuid = savedRxOrder.rxOrderId;

            // Generate URLs using the UUID only
            const PatientRxUrl = `${window.location.origin}/rx-order-qr-code/${uuid}`;
            const PharmacyQrUrl = `${window.location.origin}/rx-order-qr-code/pharmacy/${uuid}`;

            // Update state with new URLs and QR code
            setRxOrder(prevOrder => ({
                ...prevOrder,
                PatientRxUrl,
                PharmacyQrUrl,
                qrCode: savedRxOrder.qrCode,
            }));

            // Add RX order to the state and refresh medications
            addRxOrder(savedRxOrder);
            await refreshMedications();
            onNewRxOrderSaved(savedRxOrder);
=======
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
>>>>>>> main:components/patientViewModels/Medications/rx/RXOrderViewModel.ts

            // Reset form after saving
            setRxOrder({
                ...initialRxOrder,
                prescribedDate: new Date(),
                validTill: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                prescriptions: [{ diagnosis: '', medication: '', dosage: '', frequency: '' }],
                PatientRxUrl: undefined,
                PharmacyQrUrl: undefined,
                qrCode: undefined,
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