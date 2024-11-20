// app/rx-order-qr-code/[truncatedId]-[uuid]/page.tsx
'use client';

import PatientRxView from '@/components/rxQrCode/PatientRxView';

export default function RXOrderPage({ params }: { params: { uuid: string } }) {
    const { uuid } = params; // Extract the `uuid` from dynamic route params

    if (!uuid || !uuid.includes('-')) {
        return <p className="text-center text-red-500">Invalid or missing UUID</p>;
    }

    // Extract `truncatedPatientId` from the first part of the UUID
    const [truncatedPatientId] = uuid.split('-');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <PatientRxView truncatedPatientId={truncatedPatientId} uuid={uuid} />
        </div>
    );
}