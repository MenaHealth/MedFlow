import { usePatientDashboard } from '../../PatientViewModelContext';
import { IRxOrder } from '../../../../models/patient';
import { IMedOrders } from '../../../../models/medOrders';

export function usePreviousMedicationsViewModel() {
    const { rxOrders, medOrders, loadingMedications } = usePatientDashboard();

    // Access the Orders array within rxOrders
    const ordersArray = rxOrders?.Orders || [];

    const formatRxOrders = (orders: IRxOrder[]): IRxOrder[] => {
        return orders.map(order => ({
            ...order,
            medication: order.prescriptions.prescription[0]?.medication || '',
            dosage: order.prescriptions.prescription[0]?.dosage || '',
            frequency: order.prescriptions.prescription[0]?.frequency || '',
            date: order.prescribedDate,
            authorName: order.prescribingDr,
            city: order.prescriptions.city,
            validTill: order.prescriptions.validTill,
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