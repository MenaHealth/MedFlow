// components/PatientViewModels/PatientContext.tsx
"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PatientInfoViewModel } from "./patient-info/PatientInfoViewModel";
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

interface UserSession {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    accountType: 'Doctor' | 'Triage';
    isAdmin: boolean;
    image?: string;
    doctorSpecialty?: string;
    languages?: string[];
    token?: string;
    gender?: 'male' | 'female';
    dob?: Date;
    countries?: string[];
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
    refreshPatientNotes: () => Promise<void>;
    userSession: UserSession | null;
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
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState('patient-info');
    const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
    const [notes, setNotes] = useState<INote[]>([]);
    const [loadingPatientInfo, setLoadingPatientInfo] = useState(false);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [patientViewModel, setPatientViewModel] = useState<PatientInfoViewModel | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [userSession, setUserSession] = useState<UserSession | null>(null);

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            const userSessionData: UserSession = {
                id: session.user.id,
                email: session.user.email,
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                accountType: session.user.accountType,
                isAdmin: session.user.isAdmin,
                image: session.user.image,
                doctorSpecialty: session.user.doctorSpecialty,
                languages: session.user.languages,
                token: session.user.token,
                gender: session.user.gender,
                dob: session.user.dob,
                countries: session.user.countries,
            };
            setUserSession(userSessionData);
            console.log('Full user session object:', userSessionData);
        }
    }, [session, status]);

    const refreshPatientNotes = async () => {
        setLoadingNotes(true);
        try {
            await fetchPatientData(); // Re-fetches patient data, including notes2
        } catch (error) {
            console.error('Error refreshing patient notes2:', error);
        } finally {
            setLoadingNotes(false);
        }
    };

    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
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
        console.log('Formatting previous notes2:', notesData);
        if (Array.isArray(notesData)) {
            const updatedNotes = notesData.map((note: INote) => ({
                ...note,
                title: note.noteType,
                patientName: `${patientInfo?.patientName || ''}`,
            }));
            console.log('Formatted notes2:', updatedNotes);
            setNotes(updatedNotes);
        } else {
            console.log('No notes2 found or notes2 is not an array');
            setNotes([]);
        }
    };

    const fetchPatientData = useCallback(async () => {
        console.log('Fetching patient data for ID:', patientId);
        setLoadingPatientInfo(true);
        try {
            console.log('Fetching patient data for ID:', patientId);
            const response = await fetch(`/api/patient/${patientId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json() as IPatient;
            console.log('Received patient data:', data);

            formatPatientInfo(data);
            if (data.notes) {
                formatPreviousNotes(data.notes);
            } else {
                setNotes([]); // Set to empty array if no notes2
            }
        } catch (error) {
            console.error('Error fetching patient data:', error);
            // Handle the error appropriately, e.g., show an error message to the user
        } finally {
            setLoadingPatientInfo(false); // Set loading to false after completion
        }
    }, [patientId, formatPatientInfo, formatPreviousNotes]);

    // const fetchNotes = useCallback(async (noteType?: string) => {
    //     try {
    //         const url = new URL(`/api/patient/${patientId}/notes`, window.location.origin);
    //         if (noteType) {
    //             url.searchParams.append('type', noteType);
    //         }
    //         const response = await fetch(url.toString());
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         const notes = await response.json();
    //         return notes;
    //     } catch (error) {
    //         console.error('Error fetching notes2:', error);
    //         throw error;
    //     }
    // }, [patientId]);

    // const addNote = useCallback(async (noteData) => {
    //     try {
    //         const response = await fetch(`/api/patient/${patientId}/notes2/${noteData.noteType}-notes2`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(noteData),
    //         });
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         const newNote = await response.json();
    //         return newNote;
    //     } catch (error) {
    //         console.error('Error adding note:', error);
    //         throw error;
    //     }
    // }, [patientId]);
    //
    // const updateNote = useCallback(async (noteId, noteData) => {
    //     try {
    //         const response = await fetch(`/api/patient/${patientId}/notes2/doctor-notes2`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ noteId, ...noteData }),
    //         });
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         const updatedNote = await response.json();
    //         return updatedNote;
    //     } catch (error) {
    //         console.error('Error updating note:', error);
    //         throw error;
    //     }
    // }, [patientId]);


    return (
        <PatientContext.Provider
            value={{
                activeTab,
                setActiveTab,
                patientInfo,
                notes,
                loadingPatientInfo,
                loadingNotes,
                fetchPatientData,
                patientViewModel,
                isExpanded,
                toggleExpand,
                refreshPatientNotes,
                userSession,
            }}
        >
            {children}
        </PatientContext.Provider>
    );
};

export default function Component() {
    // This is a placeholder component to satisfy the React Component code block requirements
    return null;
}