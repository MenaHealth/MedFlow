// components/form/Medications/PreviousMedications.tsx
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { IRXForm } from './../../../models/RXForm';
import { IMedX } from './../../../models/MedX';

interface PreviousMedicationsProps {
    rxForms: IRXForm[];
    medicalOrders: IMedX[];
    loadingMedications: boolean;
}

export default function PreviousMedications({ rxForms, medicalOrders, loadingMedications }: PreviousMedicationsProps) {
    if (loadingMedications) {
        return <div>Loading medications...</div>;
    }

    return (
        <Card className="bg-white p-4">
            <CardHeader>
                <h2 className="text-lg font-semibold">Previous Medications</h2>
            </CardHeader>
            <CardContent className="space-y-4">
                {rxForms.length === 0 && medicalOrders.length === 0 ? (
                    <p>No previous records available.</p>
                ) : (
                    <>
                        {rxForms.map((form, index) => (
                            <Card key={`rx-${index}`} className="border border-gray-300 p-2">
                                <h3 className="font-medium text-gray-700">RX Form - {new Date(form.date).toLocaleDateString()}</h3>
                                <p><strong>Diagnosis:</strong> {form.diagnosis}</p>
                                <p><strong>Medications:</strong> {form.medicationsNeeded}</p>
                                <p><strong>Pharmacy:</strong> {form.pharmacyOrClinic}</p>
                            </Card>
                        ))}
                        {medicalOrders.map((order,

                                            index) => (
                            <Card key={`mo-${index}`} className="border border-gray-300 p-2">
                                <h3 className="font-medium text-gray-700">Medical Order - {new Date(order.date).toLocaleDateString()}</h3>
                                <p><strong>Diagnosis:</strong> {order.diagnosis}</p>
                                <p><strong>Medications:</strong> {order.medications}</p>
                                <p><strong>Dosage:</strong> {order.dosage}</p>
                                <p><strong>Frequency:</strong> {order.frequency}</p>
                            </Card>
                        ))}
                    </>
                )}
            </CardContent>
        </Card>
    );
}