// components/ConfirmationModal.jsx

import React from 'react';

const ConfirmationModal = ({ patientId, patientName, onClose, onHome }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm">
                <h2 className="text-xl font-bold mb-4">Patient Created Successfully</h2>
                <p>Patient ID: {patientId}</p>
                <p>Name: {patientName.firstName} {patientName.lastName}</p>
                <div className="flex justify-end mt-4 space-x-4">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;