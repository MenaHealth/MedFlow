// components/form/Medications/PreviousMedications.tsx
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { RXForm } from '@/models/RXForm';

interface PreviousMedicationsProps {
    previousRXForms: RXForm[];
}

export default function PreviousMedications({ previousRXForms }: PreviousMedicationsProps) {
    return (
        <Card className="bg-white p-4">
            <CardHeader>
                <h2 className="text-lg font-semibold">Previous Medications</h2>
            </CardHeader>
            <CardContent className="space-y-4">
                {previousRXForms.length === 0 ? (
                    <p>No previous records available.</p>
                ) : (
                    previousRXForms.map((form, index) => (
                        <Card key={index} className="border border-gray-300 p-2">
                            <h3 className="font-medium text-gray-700">RX Form - {new Date(form.date).toLocaleDateString()}</h3>
                            <p><strong>Diagnosis:</strong> {form.diagnosis}</p>
                            <p><strong>Medications:</strong> {form.medicationsNeeded}</p>
                            <p><strong>Pharmacy:</strong> {form.pharmacyOrClinic}</p>
                        </Card>
                    ))
                )}
            </CardContent>
        </Card>
    );
}