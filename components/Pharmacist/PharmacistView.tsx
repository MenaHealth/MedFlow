// components/pharmacist/PharmacistView.tsx

'use client';

import React, { useState, useEffect } from 'react';

interface PharmacistViewProps {
    uuid: string;
}

const PharmacistView: React.FC<PharmacistViewProps> = ({ uuid }) => {
    const [prescription, setPrescription] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrescription = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/rx-order-qr-code/uuid/${uuid}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch prescription details.');
                }
                const data = await response.json();
                setPrescription(data);
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPrescription();
    }, [uuid]);

    const handleFulfill = async () => {
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch('/api/rx-order-qr-code/pharmacist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uuid }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            const message = await response.text();
            setSuccessMessage(message);
            setPrescription((prev: any) => ({
                ...prev,
                validated: true,
            }));
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        }
    };

    if (loading) return <p>Loading prescription...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {prescription && (
                <div className="p-6 bg-white rounded-lg shadow-md max-w-md w-full space-y-4">
                    <h1 className="text-2xl font-bold">Pharmacist Portal</h1>
                    <p>Prescription for: {prescription.prescribingDr}</p>
                    <p>Specialty: {prescription.doctorSpecialty}</p>
                    <p>Valid Till: {new Date(prescription.validTill).toLocaleDateString()}</p>
                    <p>
                        Medications:
                        <ul className="list-disc ml-6">
                            {prescription.prescriptions.map(
                                (med: any, index: number) => (
                                    <li key={index}>
                                        {med.medication} - {med.dosage} -{' '}
                                        {med.frequency}
                                    </li>
                                )
                            )}
                        </ul>
                    </p>
                    <p>Status: {prescription.validated ? 'Fulfilled' : 'Pending'}</p>

                    {!prescription.validated && (
                        <button
                            onClick={handleFulfill}
                            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Fulfill Prescription
                        </button>
                    )}
                    {successMessage && (
                        <p className="text-green-500">{successMessage}</p>
                    )}
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            )}
        </div>
    );
};

export default PharmacistView;