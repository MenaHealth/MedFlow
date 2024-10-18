// app/patient/[id]/page.tsx
'use client'

import PatientViewModel from '../../../components/PatientViewModels/PatientViewModel'
import { useParams } from 'next/navigation';

const PatientView = () => {
    const { id } = useParams();

    return <PatientViewModel patientId={id} />
}

export default PatientView