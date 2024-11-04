// app/patient/[id]/page.tsx
'use client';

import PatientViewModel from './../../../components/PatientViewModels/PatientViewModel';
import { useParams } from 'next/navigation';

const PatientView = () => {
    const { id } = useParams() as { id: string }; // Explicitly define `id` as a string

    return <PatientViewModel />
}

export default PatientView;
