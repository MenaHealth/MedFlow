// components/rxQrCode/PatientRxView.tsx
// This is the view that has the QR code on it

'use client';

import React, { useEffect, useState } from 'react';

interface Prescription {
    diagnosis: string;
    medication: string;
    dosage: string;
    frequency: string;
}

interface RxOrder {
    rxOrderId: string;
    qrCode: string;
    doctorSpecialty: string;
    prescribingDr: string;
    validTill: string;
    prescriptions: Prescription[];
    PatientRxUrl: string;
    PharmacyQrUrl: string;
}

interface PatientRxViewProps {
    uuid: string;
}

const PatientRxView: React.FC<PatientRxViewProps> = ({ uuid }) => {
    const [rxOrder, setRxOrder] = useState<RxOrder | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchRxOrder = async () => {
            try {
                const response = await fetch(`/api/rx-order-qr-code/${uuid}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch RX order: ${response.status} ${response.statusText}. ${errorText}`);
                }

                const data = await response.json();
                setRxOrder(data);
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRxOrder();
    }, [uuid]);

    if (loading) {
        return <p className="text-center">Loading RX Order...</p>;
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>Error: {error}</p>
                <p>UUID: {uuid}</p>
            </div>
        );
    }

    if (!rxOrder) {
        return <p className="text-center">No RX Order found for UUID: {uuid}</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-6">
            <h1 className="text-2xl font-bold">Prescription Details</h1>
            <img src={rxOrder.qrCode} alt="QR Code for RX Order" className="border rounded-lg shadow-md" />
            <div className="p-4 bg-white rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-lg font-semibold">Order Details</h2>
                <p><strong>RX Order ID:</strong> {rxOrder.rxOrderId}</p>
                <p><strong>Doctor Specialty:</strong> {rxOrder.doctorSpecialty}</p>
                <p><strong>Prescribing Doctor:</strong> {rxOrder.prescribingDr}</p>
                <p><strong>Valid Till:</strong> {new Date(rxOrder.validTill).toLocaleDateString()}</p>
                <p><strong>Patient Rx URL:</strong> <a href={rxOrder.PatientRxUrl} className="text-blue-600 hover:underline">{rxOrder.PatientRxUrl}</a></p>
                <p><strong>Pharmacy QR URL:</strong> <a href={rxOrder.PharmacyQrUrl} className="text-blue-600 hover:underline">{rxOrder.PharmacyQrUrl}</a></p>
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

export default PatientRxView;

