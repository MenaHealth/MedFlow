// components/PatientViewModels/Medications/previous/PreviousMedicationsView.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, Share, ChevronsDown, ChevronsUp } from 'lucide-react';
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
}

const PreviousMedicationsView: React.FC<PreviousMedicationsViewProps> = ({
                                                                             rxOrders,
                                                                             medOrders,
                                                                             loadingMedications,
                                                                             isMobile,
                                                                         }) => {
    const { patientInfo } = usePatientDashboard();
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedRxOrder, setSelectedRxOrder] = useState<IRxOrder | null>(null);
    const [expandAll, setExpandAll] = useState(false);

    const allMedications = React.useMemo(() => {
        return [...rxOrders, ...medOrders].sort((a, b) => {
            const dateA = new Date('prescribedDate' in a ? a.prescribedDate : a.orderDate);
            const dateB = new Date('prescribedDate' in b ? b.prescribedDate : b.orderDate);
            return dateB.getTime() - dateA.getTime();
        });
    }, [rxOrders, medOrders]);

    const updateExpandedItems = useCallback(() => {
        setExpandedItems(new Set(expandAll ? allMedications.map(item => item._id ?? '') : []));
    }, [expandAll, allMedications]);

    useEffect(() => {
        updateExpandedItems();
    }, [updateExpandedItems]);

    if (loadingMedications) return <p aria-live="polite">Loading medications...</p>;

    const toggleItemExpansion = (itemId: string, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
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

    const toggleExpandAll = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setExpandAll(prev => !prev);
    };

    const renderMedicationItem = (item: IRxOrder | IMedOrder) => {
        const isRxOrder = 'prescriptions' in item;
        const itemId = item._id ?? '';
        const isExpanded = expandedItems.has(itemId);

        return (
            <li key={itemId} className="text-white border-white border-t-2 border-l-2 p-4 m-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <button
                            onClick={(e) => toggleItemExpansion(itemId, e)}
                            className="text-white border-white border-2 pt-0.5 pl-2 pr-2 rounded-full hover:text-orange-950 hover:bg-white transition-colors"
                            aria-expanded={isExpanded}
                            aria-controls={`medication-details-${itemId}`}
                        >
                            {isExpanded ? <ChevronUp className="h-5 w-5"/> : <ChevronDown className="h-5 w-5"/>}
                        </button>
                        <h3 className="border-white border-2 p-2 text-white inline-block ml-2">
                            {isRxOrder ? 'Rx Order' : 'Medical Order'}
                        </h3>
                    </div>
                    {isRxOrder && (
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDrawer(item as IRxOrder)}>
                            <Share/>
                            <span className="sr-only">Share Rx Order</span>
                        </Button>
                    )}
                </div>
                <p className="mt-2">{new Date(isRxOrder ? item.prescribedDate : item.orderDate).toLocaleDateString()}</p>
                <p className="mt-2">Dr. {item.doctorSpecialty}</p>
                <h4 className="text-center">Dr. {item.prescribingDr}</h4>
                {isExpanded && (
                    <div id={`medication-details-${itemId}`} className="mt-2 p-2 bg-white text-darkBlue rounded-sm">
                        <p><strong>City:</strong> {isRxOrder ? item.city : item.patientCity}</p>
                        {isRxOrder &&
                            <p><strong>Valid Till:</strong> {new Date(item.validTill).toLocaleDateString()}</p>}
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

    return (
        <div className="h-full bg-orange-950">
            <div className="flex justify-center items-center py-2">
                <button
                    onClick={toggleExpandAll}
                    className="text-white border-white border-2 pt-0.5 pl-2 pr-2 rounded-full hover:text-orange-950 hover:bg-white transition-colors"
                >
                    {expandAll ? <ChevronsUp className="h-5 w-5" /> : <ChevronsDown className="h-5 w-5" />}
                </button>
            </div>
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