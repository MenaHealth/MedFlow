// components/PatientViewModels/PatientViewModelContext.tsx
"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PatientInfoViewModel } from "./patient-info/PatientInfoViewModel";
import { IPatient } from '../../models/patient';
import { INote } from '../../models/note';
import { IRxOrder } from '../../models/patient';
import { IMedOrder } from '../../models/medOrder';
import {Types} from "mongoose";

interface PatientInfo {
    patientName: string;
    city: string;
    age: string;
    gender: string;
    dob: Date;
    phone: {
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
    draftNotes: INote[];
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
    medOrders: IMedOrder[];
    loadingMedications: boolean;
    refreshMedications: () => Promise<void>;
    addRxOrder: (newRxOrder: IRxOrder) => void;
    addMedOrder: (newMedOrder: IMedOrder) => void;
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
    const [draftNotes, setDraftNotes] = useState<INote[]>([]);
    const [loadingPatientInfo, setLoadingPatientInfo] = useState(false);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [patientViewModel, setPatientViewModel] = useState<PatientInfoViewModel | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [userSession, setUserSession] = useState<UserSession | null>(null);
    const [authorName, setAuthorName] = useState('');
    const [authorID, setAuthorID] = useState('');
    const [rxOrders, setRxOrders] = useState<IRxOrder[]>([]);
    const [medOrders, setMedOrders] = useState<IMedOrder[]>([]);
    const [loadingMedications, setLoadingMedications] = useState(false);

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            const firstName = session.user.firstName || '';
            const lastName = session.user.lastName || '';
            const userId = session.user._id || '';

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

    const memoizedUserSession = useMemo(() => userSession, [userSession]);

    const toggleExpand = () => setIsExpanded(prev => !prev);

    const formatPatientInfo = useCallback((patientData: IPatient) => {
        setPatientInfo({
            patientName: `${patientData.firstName} ${patientData.lastName}`,
            age: patientData.age || '',
            city: patientData.city || '',
            gender: patientData.genderPreference || '',
            dob: new Date(patientData.dob || Date.now()),
            phone: {
                countryCode: patientData.phone?.countryCode || '',
                phoneNumber: patientData.phone?.phoneNumber || '',
            },
            patientID: patientData._id || '',
        });
        setPatientViewModel(new PatientInfoViewModel(patientData));
    }, []);

    const memoizedPatientInfo = useMemo(() => patientInfo, [patientInfo]);

    const formatPreviousNotes = useCallback((notesData: INote[]) => {
        if (Array.isArray(notesData)) {
            // Convert the Mongoose documents to plain objects while preserving the type
            const formattedNotes = notesData.map((note) => {
                const plainNote = note.toObject ? note.toObject() : note;
                return {
                    ...plainNote,
                    title: plainNote.noteType,
                    patientName: memoizedPatientInfo?.patientName || '',
                } as INote;
            });
            setNotes(formattedNotes);
            setNotes(formattedNotes.filter((note) => note.draft === false));
            setDraftNotes(formattedNotes.filter((note) => note.draft === true));
        } else {
            setNotes([]);
            setDraftNotes([]);
        }
    }, [memoizedPatientInfo?.patientName]);

    const fetchMedOrders = useCallback(async (medOrderIds: string[]): Promise<IMedOrder[]> => {
        try {
            const response = await fetch(`/api/patient/${patientId}/medications/med-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ medOrderIds })
            });
            if (!response.ok) throw new Error("Error fetching detailed med orders data");

            const data = await response.json();
            return data as IMedOrder[];  // Ensure this is typed correctly to match IMedOrder[]
        } catch (error) {
            console.error('Error fetching med orders:', error);
            return [];
        }
    }, [patientId]);

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

            // Ensure data.rxOrders has a fallback of an empty array if undefined
            const formattedRxOrders = (data.rxOrders || []).map((order) =>
                typeof order === 'string'
                    ? {
                        id: order,
                        doctorSpecialty: 'General',
                        prescribingDr: 'Unknown',
                        drEmail: 'unknown@example.com',
                        drId: 'unknown',
                        prescribedDate: new Date(),
                        validTill: new Date(),
                        city: 'Unknown City',
                        validated: false,
                        prescriptions: []
                    } as IRxOrder
                    : order
            );
            setRxOrders(formattedRxOrders);

            // Handle medOrderIds extraction
            const medOrderIds = data.medOrders?.map(order =>
                order instanceof Types.ObjectId ? order.toString() : (order as any)._id || order
            ).filter(Boolean) as string[];

            if (medOrderIds && medOrderIds.length > 0) {
                const detailedMedOrders = await fetchMedOrders(medOrderIds);
                setMedOrders(detailedMedOrders);
            } else {
                setMedOrders([]);
            }

        } catch (error) {
            console.error('Error fetching patient data:', error);
        } finally {
            setLoadingPatientInfo(false);
            setLoadingMedications(false);
        }
    }, [patientId, formatPatientInfo, formatPreviousNotes, fetchMedOrders]);

    useEffect(() => {
        if (patientId) {
            fetchPatientData();
        }
    }, [patientId, fetchPatientData]);

    const refreshPatientNotes = () => fetchPatientData();

    const refreshMedications = async () => {
        setLoadingMedications(true);
        try {
            const response = await fetch(`/api/patient/${patientId}/medications`);
            if (!response.ok) throw new Error("Error fetching medications data");

            const data = await response.json();

            setRxOrders(data.rxOrders || []);

            const medOrderIds = data.medOrders?.map((order: string | { _id: string }) =>
                typeof order === 'string' ? order : order._id
            ).filter(Boolean) as string[];

            if (medOrderIds.length > 0) {
                const detailedMedOrders = await fetchMedOrders(medOrderIds);
                setMedOrders(detailedMedOrders);
            } else {
                setMedOrders([]);
            }

        } catch (error) {
            console.error('Error refreshing medications:', error);
        } finally {
            setLoadingMedications(false);
        }
    };

    const addRxOrder = useCallback((newRxOrder: IRxOrder) => {
        setRxOrders(prevOrders => [...prevOrders, newRxOrder]);
        fetchPatientData();
    }, [fetchPatientData]);

    const addMedOrder = useCallback((newMedOrder: IMedOrder) => {
        setMedOrders(prevOrders => [...prevOrders, newMedOrder]);
        fetchPatientData();
    }, [fetchPatientData]);

    return (
        <PatientViewModelContext.Provider
            value={{
                activeTab,
                setActiveTab,
                patientInfo: memoizedPatientInfo,
                notes,
                draftNotes,
                loadingPatientInfo,
                loadingNotes,
                fetchPatientData,
                patientViewModel,
                isExpanded,
                toggleExpand,
                refreshPatientNotes,
                userSession: memoizedUserSession,
                authorName,
                authorID,
                rxOrders,
                medOrders,
                loadingMedications,
                refreshMedications,
                addRxOrder,
                addMedOrder,
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