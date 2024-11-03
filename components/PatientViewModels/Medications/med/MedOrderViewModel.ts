// components/form/Medications/MedOrderViewModel.ts

'use client'

import { useState } from 'react';
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

    // Handle input changes
    const handleInputChange = (field: keyof MedOrder, value: any) => {
        setMedOrder((prevOrder) => ({
            ...prevOrder,
            [field]: value,
        }));
    };

    // Handle individual medication field changes
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

    // Add a new medication entry
    const addMedication = () => {
        setMedOrder((prevOrder) => ({
            ...prevOrder,
            medications: [...prevOrder.medications, { diagnosis: '', medication: '', dosage: '', frequency: '', quantity: '' }],
        }));
    };

    // Remove a medication entry
    const removeMedication = (index: number) => {
        setMedOrder((prevOrder) => ({
            ...prevOrder,
            medications: prevOrder.medications.filter((_, idx) => idx !== index),
        }));
    };

    // Submit the medical order to the API
    // Inside submitMedOrder function in MedOrderViewModel
    const submitMedOrder = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/patient/${patientId}/medications/med-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(medOrder),
            });

            if (!response.ok) throw new Error('Failed to save Med Order');

            const newMedOrder = await response.json();
            addMedOrder(newMedOrder); // Add to context after successful save
        } catch (error) {
            console.error("Failed to save Med Order:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        medOrder,
        isLoading,
        handleInputChange,
        handleMedicationChange,
        addMedication,
        removeMedication,
        submitMedOrder,
        patientInfo,
        patientViewModel,
    };
}