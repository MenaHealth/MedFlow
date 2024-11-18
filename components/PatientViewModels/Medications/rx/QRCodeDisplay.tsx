// components/PatientViewModels/Medications/rx/QRCodeDisplay.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface QRCodeDisplayProps {
    uuid: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ uuid }) => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQRCode = async () => {
            try {
                console.log('Fetching QR code for UUID:', uuid); // Debug
                const response = await fetch(`/api/rx-order-qr-code/${uuid}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch QR code: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('QR code data received:', data); // Debug
                setQrCode(data.qrCode);
            } catch (err: any) {
                console.error('Error fetching QR code:', err); // Debug
                setError(err.message || 'An unexpected error occurred');
            }
        };

        fetchQRCode();
    }, [uuid]);

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    if (!qrCode) {
        return <p>Loading QR Code...</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-lg font-semibold mb-4">Prescription QR Code</h1>
            <img src={qrCode} alt="QR Code for RX Order" className="border rounded-lg shadow-md" />
        </div>
    );
};

export default QRCodeDisplay;