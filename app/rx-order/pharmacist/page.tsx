// app/rx-order/pharmacist/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import PharmacistView from './../../../components/Pharmacist/PharmacistView';

export default function PharmacistPage() {
    const searchParams = useSearchParams();
    const uuid = searchParams?.get('uuid'); // Use optional chaining

    if (!uuid) {
        return <p className="text-red-500 text-center mt-8">No prescription UUID provided.</p>;
    }

    return <PharmacistView uuid={uuid} />;
}