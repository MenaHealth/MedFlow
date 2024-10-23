// components/PatientViewModels/PatientViewModelContext.tsx
"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PatientInfoViewModel } from "./patient-info/PatientInfoViewModel";
import { IPatient } from '../../models/patient';
import { INote } from '../../models/note';
import { IRxOrder } from '../../models/rxOrders';
import { IMedOrders } from '../../models/medOrders';

interface PatientInfo {
    patientName: string;
    age: string;
    dob: Date;
    phoneNumber: {
        countryCode: string;
        phoneNumber: string;
    };
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

interface PatientContext {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    patientInfo: PatientInfo | null;
    setPatientInfo: (patientInfo: PatientInfo | null) => void;
    notes: INote[];
    loadingPatientInfo: boolean;
    loadingNotes: boolean;
    fetchPatientData: () => Promise<void>;
    patientViewModel: PatientInfoViewModel | null;
    isExpanded: boolean;
    toggleExpand: () => void;
    refreshPatientNotes: () => Promise<void>;
    userSession: UserSession | null;
    authorName: string;
    authorID: string;
    rxOrders: IRxOrder[];
    medOrders: IMedOrders[];
    loadingMedications: boolean;
    refreshMedications: () => Promise<void>;
}

const PatientViewModelContext = createContext<PatientContext | undefined>(undefined);

export const usePatientDashboard = () => {
    const context = useContext(PatientViewModelContext);
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
    const [authorName, setAuthorName] = useState('');
    const [authorID, setAuthorID] = useState('');
    const [rxOrders, setrxOrders] = useState<IRxOrder[]>([]);
    const [medOrders, setmedOrders] = useState<IMedOrders[]>([]);
    const [loadingMedications, setLoadingMedications] = useState(false);

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            const firstName = session.user.firstName || '';
            const lastName = session.user.lastName || '';
            const userId = session.user._id || ''; // Check if this field is being populated properly

            setUserSession({
                id: userId,
                email: session.user.email,
                firstName,
                lastName,
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

            setAuthorName(`${firstName} ${lastName}`.trim());
            setAuthorID(userId);
        }
    }, [session, status]);


    const toggleExpand = () => setIsExpanded(prev => !prev);

    const formatPatientInfo = useCallback((patientData: IPatient) => {
        setPatientInfo({
            patientName: `${patientData.firstName} ${patientData.lastName}`,
            age: patientData.age || '',
            dob: new Date(patientData.dob || Date.now()),
            phoneNumber: {
                countryCode: patientData.phone?.countryCode || '',
                phoneNumber: patientData.phone?.phoneNumber || '',
            },
            patientID: patientData._id || '',
        });
        setPatientViewModel(new PatientInfoViewModel(patientData));
    }, []);

    // PatientViewModelContext.tsx

    const formatPreviousNotes = useCallback((notesData: INote[]) => {
        if (Array.isArray(notesData)) {
            // Convert the Mongoose documents to plain objects while preserving the type
            const formattedNotes = notesData.map((note) => {
                const plainNote = note.toObject ? note.toObject() : note;
                return {
                    ...plainNote,
                    title: plainNote.noteType,
                    patientName: patientInfo?.patientName || '',
                } as INote;
            });
            setNotes(formattedNotes);
        } else {
            setNotes([]);
        }
    }, [patientInfo?.patientName]);

    const fetchPatientData = useCallback(async () => {
        setLoadingPatientInfo(true);
        setLoadingMedications(true);
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
            // Set rxOrders and medOrders in the state and log them for debugging
            setrxOrders(data.rxOrders || []);
            setmedOrders(data.medOrders || []);
            console.log("RX Orders:", data.rxOrders);
            console.log("Med Orders:", data.medOrders);
        } catch (error) {
            console.error('Error fetching patient data:', error);
        } finally {
            setLoadingPatientInfo(false);
            setLoadingMedications(false);
        }
        console.log("format patient info", patientId);
    }, [patientId, formatPatientInfo, formatPreviousNotes]);

    useEffect(() => {
        if (patientId) {
            fetchPatientData();
        }
        console.log('Patient ID:', patientId);
    }, [patientId, fetchPatientData]);

    const refreshPatientNotes = () => fetchPatientData();
    const refreshMedications = () => fetchPatientData();

    return (
        <PatientViewModelContext.Provider
            value={{
                activeTab,
                setActiveTab,
                patientInfo,
                setPatientInfo,
                notes,
                loadingPatientInfo,
                loadingNotes,
                fetchPatientData,
                patientViewModel,
                isExpanded,
                toggleExpand,
                refreshPatientNotes,
                userSession,
                authorName,
                authorID,
                rxOrders,
                medOrders,
                loadingMedications,
                refreshMedications,
            }}
        >
            {children}
        </PatientViewModelContext.Provider>
    );
};

export default function Component() {
    // This is a placeholder component to satisfy the React Component code block requirements
    return null;
}