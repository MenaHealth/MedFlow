// components/rxQrCode/PatientView.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface Prescription {
    diagnosis: string;
    medication: string;
    dosage: string;
    frequency: string;
}

interface QRCodeDisplayProps {
    uuid: string;
}

const PatientView: React.FC<QRCodeDisplayProps> = ({ uuid }) => {
    const [rxOrder, setRxOrder] = useState<{
        PharmacyQrCode: string;
        doctorSpecialty: string;
        prescribingDr: string;
        validTill: string;
        prescriptions: Prescription[];
    } | null>(null);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRxOrder = async () => {
            try {
                const response = await fetch(`/api/rx-order-qr-code/patient/${uuid}`);
                if (!response.ok) {
                    throw new Error('View Failed to fetch RX order');
                }

                const data = await response.json();
                setRxOrder(data);
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred');
            }
        };

        fetchRxOrder();
    }, [uuid]);

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    if (!rxOrder) {
        return <p>Loading RX Order...</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-6">
            <h1 className="text-2xl font-bold">Prescription Details</h1>
            <img src={rxOrder.PharmacyQrCode} alt="QR Code for RX Order" className="border rounded-lg shadow-md" />
            <div className="p-4 bg-white rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-lg font-semibold">Order Details</h2>
                <p><strong>Doctor Specialty:</strong> {rxOrder.doctorSpecialty}</p>
                <p><strong>Prescribing Doctor:</strong> {rxOrder.prescribingDr}</p>
                <p><strong>Valid Till:</strong> {new Date(rxOrder.validTill).toLocaleDateString()}</p>
                <h3 className="mt-4 text-lg font-semibold">Prescriptions</h3>
                <ul className="list-disc list-inside">
                    {rxOrder.prescriptions.map((prescription, index) => (
                        <li key={index}>
                            <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                            <p><strong>Medication:</strong> {prescription.medication}</p>
                            <p><strong>Dosage:</strong> {prescription.dosage}</p>
                            <p><strong>Frequency:</strong> {prescription.frequency}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PatientView;