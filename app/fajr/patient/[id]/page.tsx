// app/fajr/patient/[id]/page.tsx
// current patient form
import { PatientForm } from "@/components/form/Fajr/PatientForm";
import PatientSubmenu from "@/components/PatientSubmenu";
import React from "react";

export default function Home({params}: {params: {id: string}}) {
    return (
        <div className="w-full max-w-4xl mx-auto pb-16"> {/* Added bottom padding to avoid nav bar overlap */}
            <PatientSubmenu />
            <h1 className="text-3xl font-bold mb-8 text-center">Patient Form</h1>
            <div className="border border-gray-300 p-8 bg-white shadow rounded-lg">
                <PatientForm id={params.id} />
            </div>
        </div>
    );
}