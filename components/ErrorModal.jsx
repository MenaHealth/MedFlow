// components/ErrorModal.jsx

import React from 'react';

const ErrorModal = ({ errorMessage, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm">
                <h2 className="text-xl font-bold mb-4 text-red-600">Error</h2>
                <p className="text-red-700">{errorMessage}</p>
                <div className="flex justify-end mt-4">
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;