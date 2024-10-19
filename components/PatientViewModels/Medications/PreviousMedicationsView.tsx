// components/PatientViewModels/PatientMedications/PreviousMedicationsView.tsx
// components/PatientViewModels/Medications/PreviousMedicationsView.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { usePreviousMedicationsViewModel } from './PreviousMedicationsViewModel';
import { ScrollArea } from './../../../components/form/ScrollArea';

export default function PreviousMedicationsView() {
    const { rxForms, medicalOrders, loadingMedications } = usePreviousMedicationsViewModel();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    if (loadingMedications) return <p>Loading medications...</p>;

    const toggleItemExpansion = (itemId: string) => {
        if (expandedItems.includes(itemId)) {
            setExpandedItems(expandedItems.filter(id => id !== itemId));
        } else {
            setExpandedItems([...expandedItems, itemId]);
        }
    };

    return (
        <div className="h-full">
            <ScrollArea className="h-full w-full">
                {rxForms.length > 0 || medicalOrders.length > 0 ? (
                    <ul className="list-none p-0">
                        {rxForms.map((rxForm) => (
                            <li key={rxForm._id} className="p-4 border-b border-gray-200 bg-white">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">RX Form: {rxForm.content.medication}</h3>
                                        <p>{new Date(rxForm.date).toLocaleDateString()}</p>
                                        <h4 className="font-bold">Prescribed by: {rxForm.authorName}</h4>
                                    </div>
                                    <button onClick={() => toggleItemExpansion(rxForm._id)} className="text-gray-600">
                                        {expandedItems.includes(rxForm._id) ? <ChevronUp /> : <ChevronDown />}
                                    </button>
                                </div>
                                {expandedItems.includes(rxForm._id) && (
                                    <div className="mt-2">
                                        <p><strong>Dosage:</strong> {rxForm.content.dosage}</p>
                                        <p><strong>Frequency:</strong> {rxForm.content.frequency}</p>
                                    </div>
                                )}
                            </li>
                        ))}
                        {medicalOrders.map((medOrder) => (
                            <li key={medOrder._id} className="p-4 border-b border-gray-200 bg-white">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">Medical Order: {medOrder.content.medications}</h3>
                                        <p>{new Date(medOrder.date).toLocaleDateString()}</p>
                                        <h4 className="font-bold">Ordered by: {medOrder.authorName}</h4>
                                    </div>
                                    <button onClick={() => toggleItemExpansion(medOrder._id)} className="text-gray-600">
                                        {expandedItems.includes(medOrder._id) ? <ChevronUp /> : <ChevronDown />}
                                    </button>
                                </div>
                                {expandedItems.includes(medOrder._id) && (
                                    <div className="mt-2">
                                        <p><strong>Dosage:</strong> {medOrder.content.dosage}</p>
                                        <p><strong>Frequency:</strong> {medOrder.content.frequency}</p>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No previous medications found for this patient.</p>
                )}
            </ScrollArea>
        </div>
    );
}