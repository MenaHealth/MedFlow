// components/PatientViewModels/Medications/PreviousMedicationsViewModel.tsx
import { usePatientDashboard } from '../../PatientViewModelContext';

export function usePreviousMedicationsViewModel() {
    const { rxOrders, medOrders, loadingMedications } = usePatientDashboard();

    return {
        rxOrders,
        medOrders,
        loadingMedications,
    };
}