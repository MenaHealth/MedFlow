"use client";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { BarLoader } from "react-spinners";
import RXForm from "@/components/form/RXForm";  // Importing the RXForm component

interface RXPageProps {
    params: {
        id: string;
    };
}

const RXPage: React.FC<RXPageProps> = ({ params }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'unauthenticated') {
        router.push('/auth'); // Redirect if unauthenticated
        return null;
    }

    if (status === 'loading') {
        return  <BarLoader />;
    }

    const username = `${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`;
    const patientId = params.id;

    return (
        <div className="w-full max-w-4xl mx-auto pb-16">
            <h1 className="text-3xl font-bold mb-8 text-center">RX Page</h1>
            <div className="border border-gray-300 p-8 bg-white shadow rounded-lg">
                {/* Render the RXForm here */}
                <RXForm patientId={patientId} username={username} />
            </div>
        </div>
    );
};

export default RXPage;

