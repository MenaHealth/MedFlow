import { usePatientDashboard } from '../../PatientViewModelContext';
import { IRxOrder } from '../../../../models/patient';

export function usePreviousMedicationsViewModel() {
    const { rxOrders, medOrders, loadingMedications } = usePatientDashboard();

    // Access the Orders array within rxOrders
    const ordersArray = rxOrders?.Orders || [];

    const formatRxOrders = (orders: IRxOrder[]): IRxOrder[] => {
        return orders.map(order => ({
            ...order,
            prescribingDr: order.prescribingDr,
            doctorSpecialization: order.doctorSpecialization,
            date: order.prescribedDate,
            validTill: order.prescriptions.validTill,
            city: order.prescriptions.city,
            prescriptions: order.prescriptions.prescription.map(prescription => ({
                diagnosis: prescription.diagnosis,
                medication: prescription.medication,
                dosage: prescription.dosage,
                frequency: prescription.frequency,
            })),
            validated: order.prescriptions.validated,
        }));
    };

    const formattedRxOrders = formatRxOrders(ordersArray);

    return {
        rxOrders: formattedRxOrders,
        medOrders,
        loadingMedications,
    };
}