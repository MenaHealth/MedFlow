// components/PatientViewModels/Medications/MedicationsViewModel.tsx

import { useState } from 'react';
import { usePatientDashboard } from "../PatientViewModelContext";

export function useMedicationsViewModel(patientId: string) {
    const { userSession, rxOrders, medOrders, loadingMedications } = usePatientDashboard();

    const [templateType, setTemplateType] = useState<'rxOrder' | 'medOrder'>('rxOrder');

    // Function to set field values dynamically without duplicating `rxOrder` and `medOrder` state
    const setMedicationField = (formType: 'rxOrder' | 'medOrder', name: string, value: string) => {
        // The actual `rxOrder` and `medOrder` state updates happen in `RXOrderViewModel` and `MedOrderViewModel`
    };

    return {
        rxOrders,
        medOrders,
        loadingMedications,
        templateType,
        setTemplateType,
        setMedicationField,
    };
}