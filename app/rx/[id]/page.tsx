"use client";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { BarLoader } from "react-spinners";
import RXOrderView from "../../../components/PatientViewModels/Medications/rx/RXOrderView";
import { useForm, FormProvider } from "react-hook-form";
import { IRxOrder } from './../../../models/rxOrders';  // Assuming this is where your form interface is defined

interface RXPageProps {
    params: {
        id: string;
    };
}

const RXPage: React.FC<RXPageProps> = ({ params }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const methods = useForm<IRxOrder['content']>();  // Initialize react-hook-form

    if (status === 'unauthenticated') {
        router.push('/auth'); // Redirect if unauthenticated
        return null;
    }

    if (status === 'loading') {
        return <BarLoader />;
    }

    const patientId = params.id;

    return (
        <div className="w-full max-w-4xl mx-auto pb-16">
            <h1 className="text-3xl font-bold mb-8 m-8 text-center">RX Page</h1>
            <div className="border border-gray-300 p-8 bg-white shadow rounded-lg">
                {/* FormProvider wraps the form and provides context to RXOrderView */}
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit((data) => {
                        console.log("Form data:", data); // Handle form submission here
                    })}>
                        <RXOrderView />
                        <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                            Submit RX Form
                        </button>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default RXPage;