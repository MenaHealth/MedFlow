// app/rx-order/pharmacist/[uuid]page.tsx
'use client';

import PharmacistView from '@/components/Pharmacist/PharmacistView';

export default function PharmacistPage({ params }: { params: { uuid: string } }) {
    const { uuid } = params;

    if (!uuid) {
        return <p className="text-red-500 text-center mt-8">No prescription UUID provided.</p>;
    }

    return <PharmacistView uuid={uuid} />;
}