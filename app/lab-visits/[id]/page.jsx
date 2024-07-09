// app/lab-visits/[id]/page.jsx
import React from 'react';
import PatientSubmenu from '../../../components/PatientSubmenu';

const LabVisits = () => {
    return (
        <div className="container mx-auto p-4">
            <PatientSubmenu />
            <h1 className="text-2xl font-bold mb-4">Lab Visits</h1>
            <p>Content for Lab Visits</p>
        </div>
    );
};

export default LabVisits;