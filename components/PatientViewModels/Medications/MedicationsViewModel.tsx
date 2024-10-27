// components/PatientViewModels/Medications/MedicationsViewModel.tsx

import { useState } from 'react';
import { usePatientDashboard } from "../PatientView*ModelContext";
import { IRxOrder } from '../../../models/patient';
import { IMedOrders } from '../../../models/medOrders';
import { DoctorSpecialtyList } from '../../../data/doctorSpecialty.enum';

export function useMedicationsViewModel(patientId: string) {
    const { userSession, rxOrders, medOrders, loadingMedications, patientInfo } = usePatientDashboard();

    const [templateType, setTemplateType] = useState<'rxOrder' | 'medicalrequest'>('rxOrder');

    // Define local state for handling individual order data without patient details
    const [rxOrder, setrxOrder] = useState<IRxOrder>({
        doctorSpecialization: userSession?.doctorSpecialty || 'Not Selected',
        prescribingDr: `${userSession?.firstName} ${userSession?.lastName}`,
        drId: userSession?.id || '',
        drEmail: userSession?.email || '',
        prescribedDate: new Date().toISOString(),
        prescriptions: {
            validTill: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            city: patientInfo?.city || '',
            validated: false,
            prescription: [{ diagnosis: '', medication: '', dosage: '', frequency: '' }],
        },
    });

    const [medicalOrder, setMedicalOrder] = useState<IMedOrders>({
        doctorSpecialty: (userSession?.doctorSpecialty as DoctorSpecialtyList) || undefined,
        medications: '',
        dosage: '',
        frequency: '',
    });

    const setMedicationField = (formType: 'rxOrder' | 'medicalrequest', name: string, value: string) => {
        if (formType === 'rxOrder') {
            setrxOrder((prevOrder) => ({
                ...prevOrder,
                prescriptions: {
                    ...prevOrder.prescriptions,
                    [name]: value,
                },
            }));
        } else {
            setMedicalOrder((prevOrder) => ({
                ...prevOrder,
                [name]: value,
            }));
        }
    };

    return {
        rxOrders,
        medOrders,
        loadingMedications,
        templateType,
        setTemplateType,
        rxOrder,
        medicalOrder,
        setMedicationField,
    };
}