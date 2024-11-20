// app/rx-order/patient/[id]/page.tsx
'use client';

import PatientRxView from '@/components/rxQrCode/PatientRxView';

export default function RXOrderPage({ params }: { params: { id: string } }) {
    const { id } = params;

    if (!id || !id.includes('-')) {
        return <p className="text-center text-red-500">Invalid or missing ID</p>;
    }

    const [truncatedPatientId, uuid] = id.split('-');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <PatientRxView truncatedPatientId={truncatedPatientId} uuid={uuid} />
        </div>
    );
}