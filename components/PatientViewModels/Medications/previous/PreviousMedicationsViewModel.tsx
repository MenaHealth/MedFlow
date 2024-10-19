// components/PatientViewModels/Medications/PreviousMedicationsViewModel.tsx
import { usePatientDashboard } from '../../PatientDashboardContext';

export function usePreviousMedicationsViewModel() {
    const { rxForms, medicalOrders, loadingMedications } = usePatientDashboard();

    return {
        rxForms,
        medicalOrders,
        loadingMedications,
    };
}