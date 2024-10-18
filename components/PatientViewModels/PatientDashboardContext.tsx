// components/PatientViewModels/PatientDashboardContext.tsx
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

const PatientDashboardContext = createContext<PatientDashboardContextType | undefined>(undefined);

export const usePatientDashboard = () => {
    const context = useContext(PatientDashboardContext);
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
    const [lastFetchTime, setLastFetchTime] = useState(0);

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            setUserSession({
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
            });
        }
    }, [session, status]);

    const toggleExpand = () => setIsExpanded(prev => !prev);

    const formatPatientInfo = useCallback((patientData: IPatient) => {
        setPatientInfo({
            patientName: `${patientData.firstName} ${patientData.lastName}`,
            age: patientData.age || '',
            gender: patientData.genderPreference || '',
            dob: new Date(patientData.dob || Date.now()),
            phoneNumber: patientData.phone || '',
            patientID: patientData._id || '',
        });
        setPatientViewModel(new PatientInfoViewModel(patientData));
    }, []);

    const formatPreviousNotes = useCallback((notesData: INote[]) => {
        if (Array.isArray(notesData)) {
            setNotes(notesData.map((note: INote) => ({
                ...note,
                title: note.noteType,
                patientName: patientInfo?.patientName || '',
            })));
        } else {
            setNotes([]);
        }
    }, [patientInfo?.patientName]);

    const fetchPatientData = useCallback(async (force = false) => {
        const now = Date.now();
        if (!force && now - lastFetchTime < 60000) { // 1 minute cooldown
            return; // Skip if less than a minute has passed since last fetch
        }

        setLoadingPatientInfo(true);
        try {
            const response = await fetch(`/api/patient/${patientId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json() as IPatient;
            formatPatientInfo(data);
            if (data.notes) {
                formatPreviousNotes(data.notes);
            } else {
                setNotes([]);
            }
            setLastFetchTime(now);
        } catch (error) {
            console.error('Error fetching patient data:', error);
        } finally {
            setLoadingPatientInfo(false);
        }
    }, [patientId, formatPatientInfo, formatPreviousNotes, lastFetchTime]);

    useEffect(() => {
        if (patientId) {
            fetchPatientData();
        }
    }, [patientId, fetchPatientData]);

    const refreshPatientNotes = () => fetchPatientData(true);

    return (
        <PatientDashboardContext.Provider
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
        </PatientDashboardContext.Provider>
    );
};

export default function Component() {
    // This is a placeholder component to satisfy the React Component code block requirements
    return null;
}