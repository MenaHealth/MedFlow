// app/rx-order-qr-code/pharmacist/[uuid]page.tsx
'use client';

import PharmacistView from '@/components/rxQrCode/PharmacistView';

export default function PharmacistRxViewPage({ params }: { params: { uuid: string } }) {
    return <PharmacistView uuid={params.uuid} />;
}