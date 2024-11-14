// components/form/Medications/MedOrderViewModel.ts

'use client'

import { useCallback, useState, useMemo } from 'react';
import { usePatientDashboard } from '@/components/PatientViewModels/PatientViewModelContext';
import { DoctorSpecialtyList } from '@/data/doctorSpecialty.enum';

interface Medication {
    diagnosis: string;
    medication: string;
    dosage: string;
    frequency: string;
    quantity: string;
}

interface MedOrder {
    doctorSpecialty: keyof typeof DoctorSpecialtyList;
    prescribingDr: string;
    drEmail: string;
    drId: string;
    patientName: string;
    patientPhone: string;
    patientCity: string;
    patientCountry: string;
    patientId: string;
    orderDate: Date;
    validated: boolean;
    medications: Medication[];
}

export function useMedOrderViewModel(patientId: string, patientName: string, city: string) {
    const { userSession, patientInfo, patientViewModel, addMedOrder } = usePatientDashboard();

    const [medOrder, setMedOrder] = useState<MedOrder>({
        doctorSpecialty: userSession?.doctorSpecialty as keyof typeof DoctorSpecialtyList || DoctorSpecialtyList.NOT_SELECTED,
        prescribingDr: `${userSession?.firstName} ${userSession?.lastName}`,
        drEmail: userSession?.email || '',
        drId: userSession?.id || '',
        patientName: patientInfo?.patientName || '',
        patientPhone: `${patientViewModel?.getExpandedDetails()?.phone?.countryCode || ''} ${patientViewModel?.getExpandedDetails()?.phone?.phoneNumber || ''}`,
        patientCity: patientViewModel?.getExpandedDetails()?.city || '',
        patientCountry: patientViewModel?.getExpandedDetails()?.country || '',
        patientId: patientId,
        orderDate: new Date(),
        validated: false,
        medications: [{ diagnosis: '', medication: '', dosage: '', frequency: '', quantity: '' }],
    });

    const [isLoading, setIsLoading] = useState(false);

    // Optimized isFormComplete logic
    const isFormComplete = useMemo(() =>
            medOrder.medications.every(medication =>
                medication.diagnosis?.trim() &&
                medication.medication?.trim() &&
                medication.dosage?.trim() &&
                medication.frequency?.trim() &&
                medication.quantity?.trim()
            ),
        [medOrder.medications]);

    const handleInputChange = (field: keyof MedOrder, value: any) => {
        setMedOrder((prevOrder) => ({
            ...prevOrder,
            [field]: value,
        }));
    };

    const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
        setMedOrder((prevOrder) => {
            const newMedications = [...prevOrder.medications];
            newMedications[index] = { ...newMedications[index], [field]: value };
            return {
                ...prevOrder,
                medications: newMedications,
            };
        });
    };

    const addMedication = () => {
        setMedOrder((prevOrder) => ({
            ...prevOrder,
            medications: [...prevOrder.medications, { diagnosis: '', medication: '', dosage: '', frequency: '', quantity: '' }],
        }));
    };

    const removeMedication = (index: number) => {
        setMedOrder((prevOrder) => ({
            ...prevOrder,
            medications: prevOrder.medications.filter((_, idx) => idx !== index),
        }));
    };

    const submitMedOrder = useCallback(async () => {
        console.log("Submit button clicked - starting Med order submission");

        if (!isFormComplete) {
            console.warn("Form incomplete - not submitting Med order.");
            return;
        }

        console.log("submitMedOrder is being called with data:", medOrder);
        setIsLoading(true);

        try {
            const response = await fetch(`/api/patient/${patientId}/medications/med-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(medOrder),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save Med order: ${errorText}`);
            }

            const savedMedOrder = await response.json();
            addMedOrder(savedMedOrder);
            console.log("Med order saved successfully:", savedMedOrder);

            // Optionally reset form here if desired
        } catch (error) {
            console.error("Failed to save Med order:", error);
        } finally {
            setIsLoading(false);
        }
    }, [medOrder, patientId, addMedOrder, isFormComplete]);

    return {
        medOrder,
        isLoading,
        isFormComplete,
        handleInputChange,
        handleMedicationChange,
        addMedication,
        removeMedication,
        submitMedOrder,
    };
}