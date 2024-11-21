//app/rx-order-qr-code/[uuid]/page.tsx
'use client';

import PatientRxView from '@/components/rxQrCode/PatientRxView';

export default function RXOrderPage({ params }: { params: { uuid: string } }) {
    const { uuid } = params;

    if (!uuid) {
        return <p className="text-center text-red-500">Invalid or missing UUID</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <PatientRxView uuid={uuid} />
        </div>
    );
}

