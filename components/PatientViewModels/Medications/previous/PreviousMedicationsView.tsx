// components/PatientViewModels/Medications/previous/PreviousMedicationsView.tsx

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Share } from 'lucide-react';
import { ScrollArea } from '../../../ui/ScrollArea';
import RxOrderDrawerView from '../rx/RxOrderDrawerView';
import { IRxOrder } from '../../../../models/patient';
import { IMedOrder } from '../../../../models/medOrder';
import { usePatientDashboard } from '@/components/PatientViewModels/PatientViewModelContext';
import { Button } from '@/components/ui/button';

interface PreviousMedicationsViewProps {
    rxOrders: IRxOrder[];
    medOrders: IMedOrder[];
    loadingMedications: boolean;
    isMobile: boolean;
    expandAll: boolean;
}

const PreviousMedicationsView: React.FC<PreviousMedicationsViewProps> = ({
                                                                             rxOrders,
                                                                             medOrders,
                                                                             loadingMedications,
                                                                             isMobile,
                                                                             expandAll
                                                                         }) => {
    const { patientInfo } = usePatientDashboard();
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedRxOrder, setSelectedRxOrder] = useState<IRxOrder | null>(null);

    useEffect(() => {
        if (expandAll) {
            setExpandedItems(new Set(allMedications.map(item => item._id ?? '')));
        } else {
            setExpandedItems(new Set());
        }
    }, [expandAll]);

    if (loadingMedications) return <p aria-live="polite">Loading medications...</p>;

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

    const renderMedicationItem = (item: IRxOrder | IMedOrder) => {
        const isRxOrder = 'prescriptions' in item;
        const itemId = item._id ?? '';
        const isExpanded = expandedItems.has(itemId);

        return (
            <li key={itemId} className="text-white border-white border-t-2 border-l-2 p-4 m-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleItemExpansion(itemId)}
                            aria-expanded={isExpanded}
                            aria-controls={`medication-details-${itemId}`}
                        >
                            {isExpanded ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />}
                            <span className="sr-only">{isExpanded ? 'Collapse' : 'Expand'} medication details</span>
                        </Button>
                        <h3 className="border-white border-2 p-2 text-white inline-block ml-2">
                            {isRxOrder ? 'Rx Order' : 'Medical Order'}
                        </h3>
                    </div>
                    {isRxOrder && (
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDrawer(item as IRxOrder)}>
                            <Share className="mr-2" />
                            <span className="sr-only">Share Rx Order</span>
                        </Button>
                    )}
                </div>
                <p className="mt-2">{new Date(isRxOrder ? item.prescribedDate : item.orderDate).toLocaleDateString()}</p>
                <h4 className="text-center">Dr. {item.prescribingDr}</h4>
                {isExpanded && (
                    <div id={`medication-details-${itemId}`} className="mt-2 p-2 bg-white text-darkBlue rounded-sm">
                        <p><strong>City:</strong> {isRxOrder ? item.city : item.patientCity}</p>
                        {isRxOrder && <p><strong>Valid Till:</strong> {new Date(item.validTill).toLocaleDateString()}</p>}
                        <h4 className="mt-2 font-bold">{isRxOrder ? 'Prescriptions:' : 'Medications:'}</h4>
                        {isRxOrder ? (
                            (item as IRxOrder).prescriptions.map((med, medIndex) => (
                                <div key={`${itemId}-med-${medIndex}`} className="mt-2 p-2 bg-gray-100 rounded-sm">
                                    <p><strong>Diagnosis:</strong> {med.diagnosis}</p>
                                    <p><strong>Medication:</strong> {med.medication}</p>
                                    <p><strong>Dosage:</strong> {med.dosage}</p>
                                    <p><strong>Frequency:</strong> {med.frequency}</p>
                                </div>
                            ))
                        ) : (
                            (item as IMedOrder).medications.map((med, medIndex) => (
                                <div key={`${itemId}-med-${medIndex}`} className="mt-2 p-2 bg-gray-100 rounded-sm">
                                    <p><strong>Diagnosis:</strong> {med.diagnosis}</p>
                                    <p><strong>Medication:</strong> {med.medication}</p>
                                    <p><strong>Dosage:</strong> {med.dosage}</p>
                                    <p><strong>Frequency:</strong> {med.frequency}</p>
                                    <p><strong>Quantity:</strong> {med.quantity}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </li>
        );
    };

    const allMedications = [...rxOrders, ...medOrders].sort((a, b) => {
        const dateA = new Date('prescribedDate' in a ? a.prescribedDate : a.orderDate);
        const dateB = new Date('prescribedDate' in b ? b.prescribedDate : b.orderDate);
        return dateB.getTime() - dateA.getTime();
    });

    return (
        <div className="h-full bg-orange-950">
            <ScrollArea className="h-full w-full">
                {allMedications.length > 0 ? (
                    <ul className="list-none m-2">
                        {allMedications.map(renderMedicationItem)}
                    </ul>
                ) : (
                    <div className="mt-2 border-white border-2 text-white rounded-lg m-4 p-4 text-center">
                        <p><strong>No previous medications found</strong> for this patient.</p>
                    </div>
                )}
            </ScrollArea>

            <RxOrderDrawerView
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                rxOrder={selectedRxOrder}
                patientId={patientInfo?.patientID || ""}
            />
        </div>
    );
};

export default PreviousMedicationsView;