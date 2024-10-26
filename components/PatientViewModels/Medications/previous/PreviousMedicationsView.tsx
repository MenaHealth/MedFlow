import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ScrollArea } from '../../../form/ScrollArea';
import { IMedOrders } from '../../../../models/medOrders';
import { usePreviousMedicationsViewModel } from './PreviousMedicationsViewModel';

export default function PreviousMedicationsView() {
    const { rxOrders, medOrders, loadingMedications } = usePreviousMedicationsViewModel();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    if (loadingMedications) return <p>Loading medications...</p>;

    const toggleItemExpansion = (itemId: string) => {
        setExpandedItems(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        );
    };

    return (
        <div className="h-full bg-orange-950">
            <ScrollArea className="h-full w-full">
                {rxOrders.length > 0 || medOrders.length > 0 ? (
                    <ul className="list-none m-2">
                        {rxOrders.map((rxOrder) => (
                            <li key={rxOrder._id}
                                className="text-white border-white border-2 p-4 m-4 rounded-lg">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="border-white border-2 p-2 text-white">RX: <strong>{rxOrder.medication}</strong></h3>
                                        <p>{new Date(rxOrder.date).toLocaleDateString()}</p>
                                        <h4 className="text-center">Dr. {rxOrder.authorName}</h4>
                                    </div>
                                    <button onClick={() => toggleItemExpansion(rxOrder._id)} className="text-white">
                                        {expandedItems.includes(rxOrder._id) ? <ChevronUp/> : <ChevronDown/>}
                                    </button>
                                </div>
                                {expandedItems.includes(rxOrder._id) && (
                                    <div className="mt-2 p-2 bg-white text-darkBlue rounded-sm">
                                        <p><strong>Medication:</strong> {rxOrder.medication}</p>
                                        <p><strong>Dosage:</strong> {rxOrder.dosage}</p>
                                        <p><strong>Frequency:</strong> {rxOrder.frequency}</p>
                                        <p><strong>City:</strong> {rxOrder.city}</p>
                                        <p><strong>Valid
                                            Till:</strong> {new Date(rxOrder.validTill).toLocaleDateString()}</p>
                                    </div>
                                )}
                            </li>
                        ))}
                        {medOrders.map((medOrder) => (
                            <li key={medOrder._id} className="p-4 border-b border-white border-2 rounded-lg">
                                <div className="flex justify-between items-center text-white">
                                    <div>
                                        <h3 className="border-2 text-white">Medical
                                            Order: <strong>{medOrder.content.medications}</strong></h3>
                                        <p>{new Date(medOrder.date).toLocaleDateString()}</p>
                                        <h4 className="text-white">Ordered by: <strong>{medOrder.authorName}</strong>
                                        </h4>
                                    </div>
                                    <button onClick={() => toggleItemExpansion(medOrder._id)} className="text-white">
                                        {expandedItems.includes(medOrder._id) ? <ChevronUp/> : <ChevronDown/>}
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
                    <div className="mt-2 border-white border-2 text-white rounded-lg m-4 p-4 text-center">
                        <p><strong>No previous medications</strong> for this patient.</p>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}