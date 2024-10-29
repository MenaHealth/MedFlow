// components/PatientViewModels/Medications/previous/PreviousMedicationsViewModel.tsx

import { usePatientDashboard } from '../../PatientViewModelContext';
import { IRxOrder } from '../../../../models/patient';
import { IMedOrder } from '../../../../models/medOrder';

export function usePreviousMedicationsViewModel() {
    const { rxOrders, medOrders, loadingMedications } = usePatientDashboard();

    const formatRxOrders = (orders: IRxOrder[]): IRxOrder[] => {
        return orders.map(order => ({
            ...order,
            prescribingDr: order.prescribingDr,
            doctorSpecialty: order.doctorSpecialty,
            date: order.prescribedDate,
            validTill: order.validTill,
            city: order.city,
            prescriptions: (order.prescriptions || []).map(prescription => ({
                diagnosis: prescription.diagnosis,
                medication: prescription.medication,
                dosage: prescription.dosage,
                frequency: prescription.frequency,
            })),
            validated: order.validated,
        }));
    };

    const formatMedOrders = (orders: IMedOrder[]): IMedOrder[] => {
        return orders.map(order => ({
            doctorSpecialty: order.doctorSpecialty,
            prescribingDr: order.prescribingDr,
            drEmail: order.drEmail,
            drId: order.drId,
            orderDate: order.orderDate,
            patientName: order.patientName,
            patientPhone: order.patientPhone,
            patientCity: order.patientCity,
            patientId: order.patientId,
            validated: order.validated,
            medications: (order.medications || []).map(medication => ({
                diagnosis: medication.diagnosis,
                medication: medication.medication,
                dosage: medication.dosage,
                frequency: medication.frequency,
                quantity: medication.quantity,
            }))
        } as IMedOrder)); // Explicitly cast to IMedOrder
    };

    const formattedRxOrders = formatRxOrders(rxOrders);
    const formattedMedOrders = formatMedOrders(medOrders);

    return {
        rxOrders: formattedRxOrders,
        medOrders: formattedMedOrders,
        loadingMedications,
    };
}