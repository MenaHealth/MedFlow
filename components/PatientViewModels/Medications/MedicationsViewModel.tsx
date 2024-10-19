// components/PatientViewModels/Medications/MedicationsViewModel.tsx
import { usePatientDashboard } from '@/components/PatientViewModels/PatientDashboardContext';

export function useMedicationsViewModel() {
    const {
        rxForms,
        medicalOrders,
        loadingMedications,
        refreshMedications,
    } = usePatientDashboard();

    return {
        rxForms,
        medicalOrders,
        loadingMedications,
        refreshMedications,
    };
}