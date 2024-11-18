// components/Pharmacist/PharmacistView.tsx

'use client';

import React, { useState } from 'react';

const PharmacistView: React.FC = () => {
    const [uuid, setUuid] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setMessage(null);
        setError(null);

        try {
            const response = await fetch('/api/rx-order-qr-code/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uuid }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            const successMessage = await response.text();
            setMessage(successMessage);
            setUuid(''); // Reset the input field
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white rounded-lg shadow-md max-w-md w-full space-y-4">
                <h1 className="text-2xl font-bold">Pharmacist Portal</h1>
                <p>Enter the UUID from the RX order QR code:</p>
                <input
                    type="text"
                    value={uuid}
                    onChange={(e) => setUuid(e.target.value)}
                    placeholder="Enter UUID"
                    className="w-full px-3 py-2 border rounded-md"
                />
                <button
                    onClick={handleSubmit}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Validate RX Order
                </button>
                {message && <p className="text-green-500 mt-4">{message}</p>}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default PharmacistView;