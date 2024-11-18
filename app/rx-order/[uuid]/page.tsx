// app/rx-order/page.tsx
'use client';

import QRCodeDisplay from '@/components/PatientViewModels/Medications/rx/QRCodeDisplay';

export default function RXOrderPage({ params }: { params: { uuid: string } }) {
    const { uuid } = params; // Extract the `uuid` from dynamic route params

    if (!uuid) {
        return <p className="text-center text-red-500">Invalid or missing UUID</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <QRCodeDisplay uuid={uuid} />
        </div>
    );
}