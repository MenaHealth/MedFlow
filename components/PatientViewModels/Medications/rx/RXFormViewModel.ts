import { useState, useEffect } from 'react';
import { RXForm } from '@/models/RXForm';
import { Session } from 'next-auth';
import { usePatientDashboard } from '@/components/PatientViewModels/PatientDashboardContext';

export function useRXFormViewModel(patientId: string) {
    const { userSession } = usePatientDashboard(); // Retrieve session data from context
    const [rxForm, setRxForm] = useState<RXForm>({
        patientName: '',
        phoneNumber: '',
        referringDr: '',
        prescribingDr: '',
        age: '',
        address: '',
        patientID: '',
        date: '',
        diagnosis: '',
        medicationsNeeded: '',
        pharmacyOrClinic: '',
        medication: '',
        dosage: '',
        frequency: '',
    });

    const [previousRXForms, setPreviousRXForms] = useState<RXForm[]>([]);

    const fetchPatientData = async () => {
        try {
            const response = await fetch(`/api/patient/${patientId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const patientData = await response.json();
            setRxForm(prevForm => ({
                ...prevForm,
                patientName: `${patientData.firstName} ${patientData.lastName}`,
                phoneNumber: patientData.phone || '',
                age: patientData.age || '',
                address: `${patientData.city}, ${patientData.country}`,
                patientID: patientData._id,
            }));
            setPreviousRXForms(patientData.RXForms || []);
        } catch (error) {
            console.error('Failed to fetch patient data:', error);
        }
    };

    useEffect(() => {
        fetchPatientData();
    }, [patientId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRxForm({
            ...rxForm,
            [e.target.name]: e.target.value,
        });
    };

    // Handle pharmacy selection
    const handlePharmacyChange = (value: string) => {
        setRxForm({
            ...rxForm,
            pharmacyOrClinic: value,
        });
    };

    const publishRXForm = async () => {
        try {
            const response = await fetch(`/api/patient/${patientId}/medications/rx-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userSession?.email,
                    date: new Date().toISOString(),
                    authorName: `${userSession?.firstName} ${userSession?.lastName}`,
                    authorID: userSession?.id,
                    content: {
                        patientName: rxForm.patientName,
                        phoneNumber: rxForm.phoneNumber,
                        age: rxForm.age,
                        address: rxForm.address,
                        referringDr: rxForm.referringDr,
                        prescribingDr: rxForm.prescribingDr,
                        diagnosis: rxForm.diagnosis,
                        medicationsNeeded: rxForm.medicationsNeeded,
                        pharmacyOrClinic: rxForm.pharmacyOrClinic, // Ensure this is passed
                        medication: rxForm.medication, // Ensure this is passed
                        dosage: rxForm.dosage,
                        frequency: rxForm.frequency,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to publish RX form');
            }

            const newRXForm = await response.json();
            setPreviousRXForms([...previousRXForms, newRXForm]);
        } catch (error) {
            console.error('Failed to publish RX form:', error);
        }
    };

    return { rxForm, handleInputChange, publishRXForm, handlePharmacyChange, previousRXForms };
}