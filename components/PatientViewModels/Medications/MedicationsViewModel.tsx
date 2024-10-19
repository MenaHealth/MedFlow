// components/PatientViewModels/Medications/MedicationsViewModel.tsx
import { useState, useCallback } from 'react';
import { usePatientDashboard } from "../PatientDashboardContext";
import { IRXForm } from '@/models/rxOrders';
import { IMedOrders } from '@/models/medOrders';

export function useMedicationsViewModel(patientId: string) {
    // Destructure all necessary properties from usePatientDashboard at once
    const { userSession, rxForms, medicalOrders, loadingMedications, refreshMedications } = usePatientDashboard();

    const [templateType, setTemplateType] = useState<'rxform' | 'medicalrequest'>('rxform');
    const [isLoading, setIsLoading] = useState(false);

    const [rxForm, setRxForm] = useState<IRXForm['content']>({
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

    const setMedicationField = (formType: 'rxform' | 'medicalrequest', name: string, value: string) => {
        if (formType === 'rxform') {
            setRxForm({
                ...rxForm,
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

        if (templateType === 'rxform') {
            medicationData = {
                email: userSession.email,
                noteType: 'rxform',
                date: new Date().toISOString(),
                authorName: `${userSession.firstName} ${userSession.lastName}`,
                authorID: userSession.id,
                content: rxForm,
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
            if (templateType === 'rxform') {
                setRxForm({
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
    }, [templateType, rxForm, medicalOrder, patientId, userSession, refreshMedications]);

    return {
        rxForms,
        medicalOrders,
        loadingMedications,
        templateType,
        setTemplateType,
        rxForm,
        medicalOrder,
        setMedicationField,
        createMedication,
        isLoading,
    };
}