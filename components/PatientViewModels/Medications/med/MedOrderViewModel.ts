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
    patientId: string;
    orderDate: Date;
    validated: boolean;
    medications: Medication[];
}

export function useMedOrderViewModel(patientId: string, patientName: string, city: string) {
    const { userSession, patientInfo, patientViewModel } = usePatientDashboard();

    const [medOrder, setMedOrder] = useState<MedOrder>({
        doctorSpecialty: userSession?.doctorSpecialty as keyof typeof DoctorSpecialtyList || DoctorSpecialtyList.NOT_SELECTED,
        prescribingDr: `${userSession?.firstName} ${userSession?.lastName}`,
        drEmail: userSession?.email || '',
        drId: userSession?.id || '',
        patientName: patientInfo?.patientName || '',
        patientPhone: patientViewModel?.getExpandedDetails()?.phone || '',
        patientCity: patientViewModel?.getExpandedDetails()?.city || '',
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
    const submitMedOrder = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/med-orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    doctorSpecialty: medOrder.doctorSpecialty,
                    prescribingDr: medOrder.prescribingDr,
                    drEmail: medOrder.drEmail,
                    drId: medOrder.drId,
                    patientName: medOrder.patientName,
                    patientPhone: medOrder.patientPhone,
                    patientCity: medOrder.patientCity,
                    patientId: medOrder.patientId,
                    orderDate: medOrder.orderDate,
                    validated: medOrder.validated,
                    medications: medOrder.medications.map(med => ({
                        diagnosis: med.diagnosis,
                        medication: med.medication,
                        dosage: med.dosage,
                        frequency: med.frequency,
                        quantity: med.quantity
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit med order');
            }

            // Handle successful submission
            console.log('Med order submitted successfully');

            // Reset the form after successful submission
            setMedOrder({
                doctorSpecialty: userSession?.doctorSpecialty as keyof typeof DoctorSpecialtyList || DoctorSpecialtyList.NOT_SELECTED,
                prescribingDr: `${userSession?.firstName} ${userSession?.lastName}`,
                drEmail: userSession?.email || '',
                drId: userSession?.id || '',
                patientName: patientInfo?.patientName || '',
                patientPhone: patientViewModel?.getExpandedDetails()?.phone || '',
                patientCity: patientViewModel?.getExpandedDetails()?.city || '',
                patientId: patientId,
                orderDate: new Date(),
                validated: false,
                medications: [{ diagnosis: '', medication: '', dosage: '', frequency: '', quantity: '' }],
            });
        } catch (error) {
            console.error('Failed to submit med order:', error);
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