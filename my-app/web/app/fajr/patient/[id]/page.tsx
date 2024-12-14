// app/fajr/patient/[id]/page.tsx
import PatientForm from "@/components/form/Fajr/PatientForm";
import React from "react";

export default function Home({params}: {params: {id: string}}) {
    return (
        <div className="w-full max-w-4xl mx-auto pb-16">
            <h1 className="text-3xl font-bold mb-8 m-8 text-center">Patient Information</h1>
            <div className="border border-gray-300 p-8 bg-white shadow rounded-lg">
            </div>
        </div>
    );
}
