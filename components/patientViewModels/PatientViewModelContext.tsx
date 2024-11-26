// components/patientViewModels/PatientViewModelContext.tsx
"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PatientInfoViewModel } from "./patient-info/PatientInfoViewModel";
import { IPatient } from '@/models/patient';
import { INote } from '@/models/note';
import { IRxOrder } from '@/models/patient';
import { IMedOrder } from '@/models/medOrder';
import {Types} from "mongoose";

export interface PatientInfo {
    patientName: string;
    city: string;
    gender: string;
    dob: Date;
    country: string;
    language: string;
    phone: {
        countryCode: string;
        phoneNumber: string;
    };
    patientID: string;
    telegramChatId?: string;
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
    const [activeTab, setActiveTab] = useState('patient-info');
    const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
    const [notes, setNotes] = useState<INote[]>([]);
    const [draftNotes, setDraftNotes] = useState<INote[]>([]);
    const [loadingPatientInfo, setLoadingPatientInfo] = useState(false);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [patientViewModel, setPatientViewModel] = useState<PatientInfoViewModel | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [rxOrders, setRxOrders] = useState<IRxOrder[]>([]);
    const [medOrders, setMedOrders] = useState<IMedOrder[]>([]);
    const [loadingMedications, setLoadingMedications] = useState(false);

    const toggleExpand = () => setIsExpanded(prev => !prev);

    const formatPatientInfo = useCallback((patientData: IPatient) => {
        const patientInfo: PatientInfo = {
            patientName: `${patientData.firstName} ${patientData.lastName}`,
            city: patientData.city || '',
            country: patientData.country || '',
            language: patientData.language || '',
            gender: patientData.genderPreference || '',
            dob: patientData.dob ? new Date(patientData.dob) : new Date(),
            phone: {
                countryCode: patientData.phone?.countryCode || '',
                phoneNumber: patientData.phone?.phoneNumber || '',
            },
            patientID: patientData._id?.toString() || '',
            telegramChatId: patientData.telegramChatId || '',
        };

        setPatientInfo(patientInfo);
        setPatientViewModel(new PatientInfoViewModel(patientData));
    }, []);

    const memoizedPatientInfo = useMemo(() => patientInfo, [patientInfo]);

    const formatPreviousNotes = useCallback((notesData: INote[]) => {
        if (Array.isArray(notesData)) {
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
            const queryString = medOrderIds.join(',');
            const response = await fetch(`/api/patient/${patientId}/medications/med-order?ids=${queryString}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error("Error fetching detailed med orders data");

            const data = await response.json();
            return data as IMedOrder[];
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

            // Handle rxOrders
            const formattedRxOrders = Array.isArray(data.rxOrders) && data.rxOrders.length > 0
                ? data.rxOrders.map((order) =>
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
                )
                : [];
            setRxOrders(formattedRxOrders);

            // Handle medOrders
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

    const refreshPatientNotes = () => fetchPatientData();

    const refreshMedications = async () => {
        setLoadingMedications(true);

        try {
            // Fetch patient data (includes RX orders and med order IDs)
            const response = await fetch(`/api/patient/${patientId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch patient data. Status: ${response.status}`);
            }

            const patientData = await response.json();

            // Set RX orders directly from patient data
            setRxOrders(patientData.rxOrders || []);

            // Extract med order IDs and use fetchMedOrders to get detailed med orders
            const medOrderIds = (patientData.medOrders || []).map((order: any) =>
                typeof order === 'string' ? order : order._id || ''
            ).filter(Boolean);

            const detailedMedOrders = await fetchMedOrders(medOrderIds);
            setMedOrders(detailedMedOrders);
        } catch (error) {
            console.error('Error refreshing medications:', error);
        } finally {
            setLoadingMedications(false);
        }
    };


    const addRxOrder = useCallback((newRxOrder: IRxOrder) => {
        setRxOrders((prevOrders) => [newRxOrder, ...prevOrders]);
    }, []);

    const addMedOrder = useCallback((newMedOrder: IMedOrder) => {
        setMedOrders((prevOrders) => [newMedOrder, ...prevOrders]); // Add the new med order to the top
    }, []);

    return (
        <PatientViewModelContext.Provider
            value={{
                activeTab,
                setActiveTab,
                patientInfo,
                setPatientInfo,
                notes,
                draftNotes,
                loadingPatientInfo,
                loadingNotes,
                fetchPatientData,
                patientViewModel,
                isExpanded,
                toggleExpand,
                refreshPatientNotes: fetchPatientData,
                rxOrders,
                medOrders,
                loadingMedications,
                refreshMedications, // <-- Pass the correct function
                addRxOrder,
                addMedOrder,
            }}
        >
            {children}
        </PatientViewModelContext.Provider>
    );
};

export default function Component() {
    return null;
}