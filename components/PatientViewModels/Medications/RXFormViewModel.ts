import { useState, useEffect } from 'react';
import { RXForm } from '@/models/RXForm';
import { Session } from 'next-auth';
import {Pharmacy} from "@/data/pharmacies.enum";

export function useRXFormViewModel(user: Session['user'], patientId: string) {
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

    useEffect(() => {
        fetchPatientData();
    }, [patientId]);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRxForm({
            ...rxForm,
            [e.target.name]: e.target.value,
        });
    };

    const publishRXForm = async () => {
        try {
            const response = await fetch(`/api/patient/rx/${patientId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'RX Form',
                    content: JSON.stringify(rxForm),
                    createdBy: {
                        userId: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                    },
                    date: new Date(),
                }),
            });
            // handle response
        } catch (error) {
            console.error('Failed to publish RX form:', error);
        }
    };

    return { rxForm, handleInputChange, publishRXForm, previousRXForms };
}