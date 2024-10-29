// components/PatientViewModels/Medications/previous/PreviousMedicationsView.tsx

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Share } from 'lucide-react';
import { ScrollArea } from '../../../form/ScrollArea';
import RxOrderDrawer from './../rx/RxOrderDrawer';
import { IRxOrder } from '../../../../models/patient';
import { IMedOrder } from '../../../../models/medOrder';

interface PreviousMedicationsViewProps {
    rxOrders: IRxOrder[];
    medOrders: IMedOrder[];
    loadingMedications: boolean;
}

const PreviousMedicationsView: React.FC<PreviousMedicationsViewProps> = ({ rxOrders, medOrders, loadingMedications }) => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedRxOrder, setSelectedRxOrder] = useState<IRxOrder | null>(null);

    if (loadingMedications) return <p>Loading medications...</p>;

    const toggleItemExpansion = (itemId: string) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const handleOpenDrawer = (rxOrder: IRxOrder) => {
        setSelectedRxOrder(rxOrder);
        setIsDrawerOpen(true);
    };

    return (
        <div className="h-full bg-orange-950">
            <ScrollArea className="h-full w-full">
                {rxOrders.length > 0 || medOrders.length > 0 ? (
                    <ul className="list-none m-2">
                        {/* Render RX Orders */}
                        {rxOrders.map((rxOrder) => (
                            <li key={rxOrder._id} className="text-white border-white border-t-2 border-l-2 p-4 m-4 rounded-lg">
                                <div className="flex justify-between">
                                    <div>
                                        <button onClick={() => toggleItemExpansion(rxOrder._id ?? '')} className="text-white">
                                            {expandedItems.has(rxOrder._id ?? '') ? <ChevronUp /> : <ChevronDown />}
                                        </button>
                                        <h3 className="border-white border-2 p-2 text-white">Rx Order</h3>
                                        <p>{new Date(rxOrder.prescribedDate).toLocaleDateString()}</p>
                                        <h4 className="text-center">Dr. {rxOrder.prescribingDr}</h4>
                                    </div>
                                    <button onClick={() => handleOpenDrawer(rxOrder)} className="text-white ml-2">
                                        <Share />
                                    </button>
                                </div>
                                {expandedItems.has(rxOrder._id ?? '') && (
                                    <div className="mt-2 p-2 bg-white text-darkBlue rounded-sm">
                                        <p><strong>City:</strong> {rxOrder.city}</p>
                                        <p><strong>Valid Till:</strong> {new Date(rxOrder.validTill).toLocaleDateString()}</p>
                                        <h4 className="mt-2 font-bold">Prescriptions:</h4>
                                        {rxOrder.prescriptions.map((prescription, index) => (
                                            <div key={`${rxOrder._id}-prescription-${index}`} className="mt-2 p-2 bg-gray-100 rounded-sm">
                                                <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                                                <p><strong>Medication:</strong> {prescription.medication}</p>
                                                <p><strong>Dosage:</strong> {prescription.dosage}</p>
                                                <p><strong>Frequency:</strong> {prescription.frequency}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}

                        {/* Render Medical Orders */}
                        {medOrders.map((medOrder) => (
                            <li key={medOrder._id} className="text-white border-white border-t-2 border-l-2 p-4 m-4 rounded-lg">
                                <div className="flex justify-between">
                                    <div>
                                        <button onClick={() => toggleItemExpansion(medOrder._id ?? '')} className="text-white">
                                            {expandedItems.has(medOrder._id ?? '') ? <ChevronUp /> : <ChevronDown />}
                                        </button>
                                        <h3 className="border-white border-2 p-2 text-white">Medical Order</h3>
                                        <p>{new Date(medOrder.orderDate).toLocaleDateString()}</p>
                                        <h4 className="text-center">Dr. {medOrder.prescribingDr}</h4>
                                    </div>
                                </div>
                                {expandedItems.has(medOrder._id ?? '') && (
                                    <div className="mt-2 p-2 bg-white text-darkBlue rounded-sm">
                                        <p><strong>City:</strong> {medOrder.patientCity}</p>
                                        <h4 className="mt-2 font-bold">Medications:</h4>
                                        {medOrder.medications.map((medication, index) => (
                                            <div key={`${medOrder._id}-medication-${index}`} className="mt-2 p-2 bg-gray-100 rounded-sm">
                                                <p><strong>Diagnosis:</strong> {medication.diagnosis}</p>
                                                <p><strong>Medication:</strong> {medication.medication}</p>
                                                <p><strong>Dosage:</strong> {medication.dosage}</p>
                                                <p><strong>Frequency:</strong> {medication.frequency}</p>
                                                <p><strong>Quantity:</strong> {medication.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="mt-2 border-white border-2 text-white rounded-lg m-4 p-4 text-center">
                        <p><strong>No previous medications found</strong> for this patient.</p>
                    </div>
                )}
            </ScrollArea>

            <RxOrderDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                rxOrder={selectedRxOrder}
            />
        </div>
    );
};

export default PreviousMedicationsView;