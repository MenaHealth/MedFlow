import { useState } from 'react';
import { usePatientDashboard } from './../../../../components/PatientViewModels/PatientViewModelContext';

interface Prescription {
    diagnosis: string;
    medication: string;
    dosage: string;
    frequency: string;
}

interface RxOrder {
    doctorSpecialization: string;
    prescribingDr: string;
    drId: string;
    drEmail: string;
    prescribedDate: Date;
    prescriptions: {
        validTill: Date;
        city: string;
        prescriptions: Prescription[];
    };
    validated?: boolean;
}

export function useRXOrderViewModel(patientId: string) {
    const { userSession, patientInfo, patientViewModel } = usePatientDashboard();
    console.log("User session email:", userSession?.email);

    const [rxOrder, setRxOrder] = useState<RxOrder>({
        doctorSpecialization: userSession?.doctorSpecialty || 'Not Selected',
        prescribingDr: `${userSession?.firstName} ${userSession?.lastName}`,
        drEmail: userSession?.email || '',
        drId: userSession?.id || '',
        prescribedDate: new Date(),
        prescriptions: {
            validTill: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            city: patientViewModel?.getExpandedDetails()?.city || '',
            prescriptions: [
                { diagnosis: '', medication: '', dosage: '', frequency: '' }
            ],
        },
        validated: false
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: keyof RxOrder['prescriptions'], value: any) => {
        setRxOrder((prevOrder) => ({
            ...prevOrder,
            prescriptions: {
                ...prevOrder.prescriptions,
                [field]: value,
            },
        }));
    };

    const handlePrescriptionChange = (index: number, field: keyof Prescription, value: string) => {
        setRxOrder((prevOrder) => {
            const newPrescriptions = [...prevOrder.prescriptions.prescriptions];
            newPrescriptions[index] = { ...newPrescriptions[index], [field]: value };
            return {
                ...prevOrder,
                prescriptions: {
                    ...prevOrder.prescriptions,
                    prescriptions: newPrescriptions,
                },
            };
        });
    };

    const addPrescription = () => {
        setRxOrder((prevOrder) => ({
            ...prevOrder,
            prescriptions: {
                ...prevOrder.prescriptions,
                prescriptions: [...prevOrder.prescriptions.prescriptions, { diagnosis: '', medication: '', dosage: '', frequency: '' }],
            },
        }));
    };

    const removePrescription = (index: number) => {
        setRxOrder((prevOrder) => ({
            ...prevOrder,
            prescriptions: {
                ...prevOrder.prescriptions,
                prescriptions: prevOrder.prescriptions.prescriptions.filter((_, idx) => idx !== index),
            },
        }));
    };

    const submitRxOrder = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/patient/${patientId}/medications/rx-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rxOrder),
            });

            if (!response.ok) {
                throw new Error('Failed to publish RX form');
            }

            const newRxOrder = await response.json();
            // Handle successful submission

            // Reset the form
            setRxOrder({
                doctorSpecialization: userSession?.doctorSpecialty || 'Not Selected',
                prescribingDr: `${userSession?.firstName} ${userSession?.lastName}`,
                drId: userSession?.id || '',
                drEmail: userSession?.email || '',
                prescribedDate: new Date(),
                prescriptions: {
                    validTill: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                    city: patientViewModel?.getExpandedDetails()?.city || '',
                    prescriptions: [{ diagnosis: '', medication: '', dosage: '', frequency: '' }],
                },
                validated: false
            });
        } catch (error) {
            console.error('Failed to publish RX form:', error);
        } finally {
            console.log("RX Order before submission:", rxOrder); // Verify structure and values
            setIsLoading(false);
        }
    };

    return {
        rxOrder,
        submitRxOrder,
        isLoading,
        handleInputChange,
        handlePrescriptionChange,
        addPrescription,
        removePrescription,
        patientInfo,
        patientViewModel
    };
}