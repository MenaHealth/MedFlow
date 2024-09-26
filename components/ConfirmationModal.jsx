// components/ConfirmationModal.jsx

import { CheckBox } from '@mui/icons-material';
import React from 'react';

const ConfirmationModal = ({ patientId, patientName, onClose, submittingFromNoSession, setSubmittingFromNoSession, submit }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-xl">
            {submittingFromNoSession ? (
                <>
                    <h2 className="text-2xl font-bold mb-4 text-center">New Patient Request</h2>
                    <br />
                    <p>Name: {patientName.firstName} {patientName.lastName}</p>
                    <br />
                    <p>I declare that the information provided in this form is true.</p>
                    <br />
                    <p>I declare that I am requesting MENA Health&apos;s services for a remote health consultation.</p>
                    <br />
                    <p>I declare that I have read the registration conditions provided below, and agree to its terms.</p>
                    <br />
                    <h2 className="text-xl font-bold mb-4">Patient Registration Terms & Conditions:</h2>
                    <p>&bull;&nbsp;Share my data with members of the non-profit organization &quot;MENA Health&quot; and members of the licensed medical staff</p>
                    <br />
                    <p>&bull;&nbsp;The possibility of transferring my data to other associations/non-governmental organization that can assist with my request or provide medicine when needed</p>
                    <br />
                    <input type="checkbox" id="agree" name="agree" value="agree" />
                    <label for="agree" className='text-gray-500'>&nbsp;Please check this box confirming you have read and understand the patient registration terms and agree.</label>

                    <div className="flex justify-end mt-4 space-x-4">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={() => {
                                if (document.getElementById('agree').checked) {
                                    submit();
                                } else {
                                    alert('Please agree to the terms and conditions.');
                                }
                            }}
                        >
                            Submit
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={() => {
                                onClose();
                            }}
                        >
                            Close
                        </button>
                    </div>
                </>
            ) : (
                <>
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
                </>
            )}
            </div>
        </div>
    );
};

export default ConfirmationModal;