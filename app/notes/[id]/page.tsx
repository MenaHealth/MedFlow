// app/notes/[id]/page.tsx
"use client"

import React from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import NotesForm from "@/components/form/NotesForm";
import PatientSubmenu from "@/components/PatientSubmenu";

interface NotesPageProps {
    params: {
        id: string;
    };
}

const NotesPage: React.FC<NotesPageProps> = ({ params }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'unauthenticated') {
        router.push('/auth');
        return null;
    }

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    const username = `${session?.user?.firstName} ${session?.user?.lastName}`;

    return (
        <div className="w-full max-w-4xl mx-auto pb-16">
            <PatientSubmenu />
            <h1 className="text-3xl font-bold mb-8 text-center">Notes</h1>
            <div className="border border-gray-300 p-8 bg-white shadow rounded-lg">
                <NotesForm patientId={params.id} username={username} />
            </div>
        </div>
    );
};

export default NotesPage;