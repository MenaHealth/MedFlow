// components/PatientSubmenuHeader.tsx
import React, { useState, useEffect } from 'react';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import ReadOnlyField from "@/components/form/ReadOnlyField";

interface PatientSubmenuHeaderProps {
    patientId: string;
}

interface PatientData {
    patientName: string;
    age: string;
    gender: string;
    dob: Date;
    phoneNumber: string;
    patientID: string;
}

const PatientSubmenuHeader: React.FC<PatientSubmenuHeaderProps> = ({ patientId }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [patientData, setPatientData] = useState<PatientData | null>(null);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await fetch(`/api/patient/${patientId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch patient data. Status: ${response.status}`);
                }
                const data = await response.json();

                // Transform data to match PatientData interface
                setPatientData({
                    patientName: `${data.firstName} ${data.lastName}`,
                    phoneNumber: data.phone || 'N/A',
                    age: data.age || 'N/A',
                    patientID: data._id || 'N/A',
                    date: new Date().toLocaleDateString(),
                });
            } catch (error) {
                console.error("Error fetching patient data:", error);
            }
        };

        fetchPatientData();
    }, [patientId]);

    return (
        <div className="bg-white shadow-md p-4 flex flex-col border-b border-gray-300">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-lg font-semibold text-gray-800">Patient Information</h2>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>

            {isExpanded && patientData && (
                <div className="mt-2 space-y-2 text-sm text-gray-600">
                    <ReadOnlyField fieldName="patientName" fieldLabel="Patient Name" value={patientData.patientName} />
                    <ReadOnlyField fieldName="phoneNumber" fieldLabel="Phone Number" value={patientData.phoneNumber} />
                    <ReadOnlyField fieldName="age" fieldLabel="Age" value={patientData.age} />
                    <ReadOnlyField fieldName="patientID" fieldLabel="Patient ID" value={patientData.patientID} />
                    <ReadOnlyField fieldName="date" fieldLabel="Date" value={patientData.date} />
                </div>
            )}
        </div>
    );
};

export default PatientSubmenuHeader;