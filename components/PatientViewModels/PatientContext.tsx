// components/PatientViewModels/PatientContext.tsx




"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { PatientInfoViewModel } from "@/components/PatientViewModels/patient-info/PatientInfoViewModel";
import { IPatient } from '../../models/patient';
import { INote } from '../../models/note';

interface PatientInfo {
    patientName: string;
    age: string;
    gender: string;
    dob: Date;
    phoneNumber: string;
    patientID: string;
}

interface PatientDashboardContextType {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    patientInfo: PatientInfo | null;
    notes: INote[];
    loadingPatientInfo: boolean;
    loadingNotes: boolean;
    fetchPatientData: () => Promise<void>;
    patientViewModel: PatientInfoViewModel | null;
    isExpanded: boolean;
    toggleExpand: () => void;
}

const PatientContext = createContext<PatientDashboardContextType | undefined>(undefined);

export const usePatientDashboard = () => {
    const context = useContext(PatientContext);
    if (!context) {
        throw new Error("usePatientDashboard must be used within PatientDashboardProvider");
    }
    return context;
};

export const PatientDashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { id: patientId } = useParams() as { id: string };
    const [activeTab, setActiveTab] = useState('patient-info');
    const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
    const [notes, setNotes] = useState<INote[]>([]);
    const [loadingPatientInfo, setLoadingPatientInfo] = useState(false);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [patientViewModel, setPatientViewModel] = useState<PatientInfoViewModel | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };

    const fetchPatientData = useCallback(async () => {
        console.log('Fetching patient data for ID:', patientId);
        setLoadingPatientInfo(true);
        try {
            const response = await fetch(`/api/patient/${patientId}`);
            const data = await response.json() as IPatient;
            console.log('Received patient data:', data);

            formatPatientInfo(data);

            // Set notes directly from the fetched patient data
            if (data.notes) {
                formatPreviousNotes(data.notes);
            } else {
                setNotes([]); // Initialize with empty array if no notes are found
            }
        } catch (error) {
            console.error('Error fetching patient data:', error);
        } finally {
            setLoadingPatientInfo(false);
        }
    }, [patientId]);

    const fetchNotes = async (patientId: string) => {
        console.log('Fetching notes for patient ID:', patientId);
        try {
            const response = await fetch(`/api/patient/${patientId}/notes`);
            const notesData = await response.json() as INote[];
            console.log('Received notes data:', notesData);
            formatPreviousNotes(notesData);
        } catch (error) {
            console.error('Error fetching notes:', error);
            setNotes([]);
        }
    };

    const formatPatientInfo = (patientData: IPatient) => {
        console.log('Formatting patient info:', patientData);
        setPatientInfo({
            patientName: `${patientData.firstName} ${patientData.lastName}`,
            age: patientData.age || '',
            gender: patientData.genderPreference || '',
            dob: new Date(patientData.dob || Date.now()),
            phoneNumber: patientData.phone || '',
            patientID: patientData._id || '',
        });

        setPatientViewModel(new PatientInfoViewModel(patientData));
        console.log('Patient info formatted and set');
    };

    const formatPreviousNotes = (notesData: INote[]) => {
        console.log('Formatting previous notes:', notesData);
        if (Array.isArray(notesData)) {
            const updatedNotes = notesData.map((note: INote) => ({
                ...note,
                title: note.noteType,
                patientName: `${patientInfo?.patientName || ''}`,
            }));
            console.log('Formatted notes:', updatedNotes);
            setNotes(updatedNotes);
        } else {
            console.log('No notes found or notes is not an array');
            setNotes([]);
        }
    };

    return (
        <PatientContext.Provider
            value={{
                activeTab,
                setActiveTab,
                patientInfo,
                notes,
                loadingPatientInfo,
                fetchPatientData,
                patientViewModel,
                isExpanded,
                toggleExpand,
            }}
        >
            {children}
        </PatientContext.Provider>
    );
};