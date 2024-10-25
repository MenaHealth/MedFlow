import { useState } from 'react';
import { usePatientDashboard } from './../../../../components/PatientViewModels/PatientViewModelContext';
import { DoctorSpecialties } from './../../../../data/doctorSpecialty.enum';

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
    prescribedDate: Date;
    Rx: {
        validTill: Date;
        prescriptions: Prescription[];
    }
}

export function useRXOrderViewModel(patientId: string) {
    const { userSession, patientInfo, patientViewModel } = usePatientDashboard();

    const [rxOrder, setRxOrder] = useState<RxOrder>({
        doctorSpecialization: userSession?.doctorSpecialty || DoctorSpecialties.NOT_SELECTED,
        prescribingDr: `${userSession?.firstName} ${userSession?.lastName}`,
        drId: userSession?.id || '',
        prescribedDate: new Date(),
        Rx: {
            validTill: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            prescriptions: [{ diagnosis: '', medication: '', dosage: '', frequency: '' }]
        }
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: keyof RxOrder['Rx'], value: any) => {
        setRxOrder((prevOrder) => ({
            ...prevOrder,
            Rx: {
                ...prevOrder.Rx,
                [field]: value,
            },
        }));
    };

    const handlePrescriptionChange = (index: number, field: keyof Prescription, value: string) => {
        setRxOrder((prevOrder) => {
            const newPrescriptions = [...prevOrder.Rx.prescriptions];
            newPrescriptions[index] = { ...newPrescriptions[index], [field]: value };
            return {
                ...prevOrder,
                Rx: {
                    ...prevOrder.Rx,
                    prescriptions: newPrescriptions,
                },
            };
        });
    };

    const addPrescription = () => {
        setRxOrder((prevOrder) => ({
            ...prevOrder,
            Rx: {
                ...prevOrder.Rx,
                prescriptions: [...prevOrder.Rx.prescriptions, { diagnosis: '', medication: '', dosage: '', frequency: '' }],
            },
        }));
    };

    const removePrescription = (index: number) => {
        setRxOrder((prevOrder) => ({
            ...prevOrder,
            Rx: {
                ...prevOrder.Rx,
                prescriptions: prevOrder.Rx.prescriptions.filter((_, idx) => idx !== index),
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
                body: JSON.stringify(rxOrder), // Make sure RxOrder contains prescriptions
            });

            if (!response.ok) {
                throw new Error('Failed to publish RX form');
            }

            const newRxOrder = await response.json();
            // Handle successful submission

            // Reset the form
            setRxOrder({
                doctorSpecialization: userSession?.doctorSpecialty || DoctorSpecialties.NOT_SELECTED,
                prescribingDr: `${userSession?.firstName} ${userSession?.lastName}`,
                drId: userSession?.id || '',
                prescribedDate: new Date(),
                Rx: {
                    validTill: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                    prescriptions: [{ diagnosis: '', medication: '', dosage: '', frequency: '' }]
                }
            });
        } catch (error) {
            console.error('Failed to publish RX form:', error);
        } finally {
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