// app/lab-visits/[id]/page.tsx
import React from 'react';
import PatientSubmenu from '../../../components/PatientSubmenu';

const LabVisits = () => {
    return (
        <div className="w-full max-w-4xl mx-auto pb-16">
            <PatientSubmenu />
            <h1 className="text-3xl font-bold mb-8 text-center">Lab Visits</h1>
            <div className="border border-gray-300 p-8 bg-white shadow rounded-lg">
        </div>
        </div>
    );
};

export default LabVisits;