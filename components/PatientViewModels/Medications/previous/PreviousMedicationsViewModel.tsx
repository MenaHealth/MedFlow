// components/PatientViewModels/Medications/previous/PreviousMedicationsViewModel.tsx
import { usePatientDashboard } from '../../PatientViewModelContext';
import { IRxOrder } from '../../../../models/patient';

export function usePreviousMedicationsViewModel() {
    const { rxOrders, medOrders, loadingMedications } = usePatientDashboard();

    const formatRxOrders = (orders: IRxOrder[]): IRxOrder[] => {
        return orders.map(order => ({
            ...order,
            prescribingDr: order.prescribingDr,
            doctorSpecialization: order.doctorSpecialization,
            date: order.prescribedDate,
            validTill: order.validTill, // top-level property in IRxOrder
            city: order.city, // top-level property in IRxOrder
            prescriptions: (order.prescriptions || []).map(prescription => ({
                diagnosis: prescription.diagnosis,
                medication: prescription.medication,
                dosage: prescription.dosage,
                frequency: prescription.frequency,
            })),
            validated: order.validated, // top-level property in IRxOrder
        }));
    };

    const formattedRxOrders = formatRxOrders(rxOrders);

    return {
        rxOrders: formattedRxOrders,
        medOrders,
        loadingMedications,
    };
}