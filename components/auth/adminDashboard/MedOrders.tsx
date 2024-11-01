// components/auth/adminDashboard/ExistingUsers.tsx

import React from 'react';
import { BarLoader } from 'react-spinners';

interface Medication {
    medication: string;
    dosage: string;
    frequency: string;
    quantity: string;
}

interface MedOrder {
    _id: string;
    patientName: string;
    prescribingDr: string;
    doctorSpecialty: string;
    medications: Medication[];
    orderDate: string;
}

interface MedOrdersProps {
    loadingMedOrders: boolean;
    isRefreshing: boolean;
    medOrdersData: MedOrder[];
}

const MedOrders: React.FC<MedOrdersProps> = ({ loadingMedOrders, isRefreshing, medOrdersData }) => (
    <div className="p-4 overflow-x-auto bg-darkBlue">
        {(loadingMedOrders || isRefreshing) ? (
            <div className="flex justify-center items-center py-4">
                <BarLoader color="var(--orange-500)" />
            </div>
        ) : (
            medOrdersData.length > 0 ? (
                <div>
                    {medOrdersData.map(order => (
                        <div key={order._id} className="bg-white text-darkBlue p-4 mb-4 rounded shadow-md">
                            <p><strong>Patient:</strong> {order.patientName}</p>
                            <p><strong>Doctor:</strong> {order.prescribingDr} ({order.doctorSpecialty})</p>
                            <p><strong>Medications:</strong></p>
                            <ul>
                                {order.medications.map((med, index) => (
                                    <li key={index}>
                                        <strong>{med.medication}</strong> - {med.dosage} ({med.frequency}), {med.quantity}
                                    </li>
                                ))}
                            </ul>
                            <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-white">No Med Orders found.</p>
            )
        )}
    </div>
);

export default MedOrders;