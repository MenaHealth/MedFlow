// components/PatientViewModels/Medications/previous/PreviousMedicationsView.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ScrollArea } from '../../../form/ScrollArea';
import { IMedOrders } from './../../../../models/medOrders'; // Import medOrders interface
import { IRxOrder } from './../../../../models/rxOrders'; // Import RxOrders interface

// Define props interface for PreviousMedicationsView
interface PreviousMedicationsViewProps {
    rxOrders: IRxOrder[];
    medOrders: IMedOrders[];
    loadingMedications: boolean;
}

export default function PreviousMedicationsView({
                                                    rxOrders,
                                                    medOrders,
                                                    loadingMedications,
                                                }: PreviousMedicationsViewProps) {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    if (loadingMedications) return <p>Loading medications...</p>;

    const toggleItemExpansion = (itemId: string) => {
        if (expandedItems.includes(itemId)) {
            setExpandedItems(expandedItems.filter((id) => id !== itemId));
        } else {
            setExpandedItems([...expandedItems, itemId]);
        }
    };

    return (
        <div className="h-full">
            <ScrollArea className="h-full w-full">
                {rxOrders.length > 0 || medOrders.length > 0 ? (
                    <ul className="list-none p-0">
                        {rxOrders.map((rxOrder) => (
                            <li key={rxOrder._id} className="p-4 border-b border-gray-200 bg-white rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">RX Form: {rxOrder.content.medication}</h3>
                                        <p>{new Date(rxOrder.date).toLocaleDateString()}</p>
                                        <h4 className="font-bold">Prescribed by: {rxOrder.authorName}</h4>
                                    </div>
                                    <button onClick={() => toggleItemExpansion(rxOrder._id)} className="text-gray-600">
                                        {expandedItems.includes(rxOrder._id) ? <ChevronUp /> : <ChevronDown />}
                                    </button>
                                </div>
                                {expandedItems.includes(rxOrder._id) && (
                                    <div className="mt-2">
                                        <p><strong>Dosage:</strong> {rxOrder.content.dosage}</p>
                                        <p><strong>Frequency:</strong> {rxOrder.content.frequency}</p>
                                    </div>
                                )}
                            </li>
                        ))}
                        {medOrders.map((medOrder) => (
                            <li key={medOrder._id} className="p-4 border-b border-white border-2 rounded-lg">
                                <div className="flex justify-between items-center text-white">
                                    <div>
                                        <h3 className="border-2 text-white">Medical
                                            Order: <strong>{medOrder.content.medications}
                                                </strong></h3>
                                        <p>{new Date(medOrder.date).toLocaleDateString()}</p>
                                        <h4 className="text-white">Ordered by: <strong>{medOrder.authorName}</strong>
                                        </h4>
                                    </div>
                                    <button onClick={() => toggleItemExpansion(medOrder._id)} className="text-white">
                                        {expandedItems.includes(medOrder._id) ? <ChevronUp /> : <ChevronDown />}
                                    </button>
                                </div>
                                {expandedItems.includes(medOrder._id) && (
                                    <div className="mt-2 bg-white text-darkBlue">
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