// components/PatientViewModels/Medications/MedicationsViewModel.tsx
import { useState, useCallback } from 'react';
import { usePatientDashboard } from "../PatientViewModelContext";
import { IRxOrder } from '@/models/rxOrders';
import { IMedOrders } from '@/models/medOrders';

export function useMedicationsViewModel(patientId: string) {
    // Destructure all necessary properties from usePatientDashboard at once
    const { userSession, rxOrders, medOrders, loadingMedications, refreshMedications } = usePatientDashboard();

    const [templateType, setTemplateType] = useState<'rxOrder' | 'medicalrequest'>('rxOrder');
    const [isLoading, setIsLoading] = useState(false);

    const [rxOrder, setrxOrder] = useState<IRxOrder['content']>({
        patientName: '',
        phoneNumber: '',
        age: '',
        address: '',
        patientID: '',
        referringDr: '',
        prescribingDr: '',
        diagnosis: '',
        medicationsNeeded: '',
        pharmacyOrClinic: '',
        medication: '',
        dosage: '',
        frequency: '',
    });

    const [medicalOrder, setMedicalOrder] = useState<IMedOrders['content']>({
        doctorSpecialty: userSession?.doctorSpecialty || '',
        patientName: '',
        patientPhoneNumber: '',
        patientAddress: '',
        diagnosis: '',
        medications: '',
        dosage: '',
        frequency: '',
    });

    const setMedicationField = (formType: 'rxOrder' | 'medicalrequest', name: string, value: string) => {
        if (formType === 'rxOrder') {
            setrxOrder({
                ...rxOrder,
                [name]: value
            });
        } else {
            setMedicalOrder({
                ...medicalOrder,
                [name]: value
            });
        }
    };

    const createMedication = useCallback(async () => {
        if (!userSession?.email || !patientId) {
            console.error('Missing user session or patient ID');
            return;
        }

        let medicationData;
        let endpoint;

        if (templateType === 'rxOrder') {
            medicationData = {
                email: userSession.email,
                noteType: 'rxOrder',
                date: new Date().toISOString(),
                authorName: `${userSession.firstName} ${userSession.lastName}`,
                authorID: userSession.id,
                content: rxOrder,
            };
            endpoint = `/api/patient/${patientId}/medications/rx-order`;  // RX Order endpoint
        } else {
            medicationData = {
                email: userSession.email,
                noteType: 'medx',
                date: new Date().toISOString(),
                authorName: `${userSession.firstName} ${userSession.lastName}`,
                authorID: userSession.id,
                content: medicalOrder,
            };
            endpoint = `/api/patient/${patientId}/medications/med-order`;  // Medical Order endpoint
        }

        try {
            setIsLoading(true);
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(medicationData),
            });

            if (!response.ok) {
                throw new Error(`Failed to create medication: ${response.status}`);
            }

            const newMedication = await response.json();
            await refreshMedications();

            // Reset form fields after successful creation
            if (templateType === 'rxOrder') {
                setrxOrder({
                    patientName: '',
                    phoneNumber: '',
                    age: '',
                    address: '',
                    patientID: '',
                    referringDr: '',
                    prescribingDr: '',
                    diagnosis: '',
                    medicationsNeeded: '',
                    pharmacyOrClinic: '',
                    medication: '',
                    dosage: '',
                    frequency: '',
                });
            } else {
                setMedicalOrder({
                    doctorSpecialty: '',
                    patientName: '',
                    patientPhoneNumber: '',
                    patientAddress: '',
                    diagnosis: '',
                    medications: '',
                    dosage: '',
                    frequency: '',
                });
            }

            console.log('Medication created:', newMedication);
        } catch (error) {
            console.error('Error creating medication:', error);
        } finally {
            setIsLoading(false);
        }
    }, [templateType, rxOrder, medicalOrder, patientId, userSession, refreshMedications]);

    return {
        rxOrders,
        medOrders,
        loadingMedications,
        templateType,
        setTemplateType,
        rxOrder,
        medicalOrder,
        setMedicationField,
        createMedication,
        isLoading,
    };
}