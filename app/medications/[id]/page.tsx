// app/medications/[id]/page.tsx

"use client";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { BarLoader } from "react-spinners";
import MedicationsView from "./../../../components/PatientViewModels/Medications/MedicationsView";
import PatientSubmenu from "./../../../components/PatientSubmenu";

interface MedicationsPageProps {
    params: {
        id: string;
    };
}

const MedicationsPage: React.FC<MedicationsPageProps> = ({ params }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'unauthenticated') {
        router.push('/auth');
        return null;
    }

    if (status === 'loading' || !session) {
        return <BarLoader />;
    }

    const patientId = params.id;

    return (
        <div className="w-full mx-auto pb-16">
            <PatientSubmenu />
            <h1 className="text-3xl font-bold mb-8 text-center m-4 text-orange-500">Medications</h1>
            <div className="border border-gray-300 p-8 bg-grey-100 shadow rounded-lg">
                <MedicationsView patientId={params.id} />
            </div>
        </div>
    );
};

export default MedicationsPage;