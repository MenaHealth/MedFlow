// app/rx-order/pharmacy/[uuid]/page.tsx
'use client';

import PharmacyView from '@/components/rxQrCode/PharmacyView';

export default function PharmacistRxViewPage({ params }: { params: { uuid: string } }) {
    return <PharmacyView uuid={params.uuid} />;
}