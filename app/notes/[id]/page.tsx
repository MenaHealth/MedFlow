// app/notes/[id]/page.tsx
"use client"

import React from 'react';
import NotesForm from "@/components/form/NotesForm";
import PatientSubmenu from "@/components/PatientSubmenu";

interface NotesPageProps {
    params: {
        id: string;
    }
}

const NotesPage: React.FC<NotesPageProps> = ({ params }) => {
    return (
        <div className="w-full max-w-4xl mx-auto pb-16"> {/* Added bottom padding to avoid nav bar overlap */}
            <PatientSubmenu />
            <h1 className="text-3xl font-bold mb-8 text-center">Notes</h1>
            <div className="border border-gray-300 p-8 bg-white shadow rounded-lg">
                <NotesForm patientId={params.id} />
            </div>
        </div>
    );
}

export default NotesPage;