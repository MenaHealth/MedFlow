// app/notes/[id]/page.tsx
"use client"

import React from 'react';
import { useSession } from "next-auth/react";
import NotesForm from "@/components/form/NotesForm";
import PatientSubmenu from "@/components/PatientSubmenu";

interface NotesPageProps {
    params: {
        id: string;
    }
}

const NotesPage: React.FC<NotesPageProps> = ({ params }) => {
    const { data: session } = useSession();
    const username = session?.user?.name || session?.user?.email || 'Anonymous';

    return (
        <div className="w-full max-w-4xl mx-auto pb-16">
            <PatientSubmenu />
            <h1 className="text-3xl font-bold mb-8 text-center">Notes</h1>
            <div className="border border-gray-300 p-8 bg-white shadow rounded-lg">
                <NotesForm patientId={params.id} username={username} />
            </div>
        </div>
    );
}

export default NotesPage;