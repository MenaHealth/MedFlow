import React from 'react';
import PatientSubmenu from "../../../components/PatientSubmenu";

const Notes = () => {
    return (
        <div className="container mx-auto p-4">
            <PatientSubmenu />
            <h1 className="text-2xl font-bold mb-4">Notes</h1>
            <p>Content for Notes</p>
        </div>
    );
};

export default Notes;