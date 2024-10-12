// components/PatientViewModels/PatientContext.tsx
"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useParams } from 'next/navigation'
import { PatientInfoViewModel } from "@/components/PatientViewModels/patient-info/PatientInfoViewModel";
import { NotesViewModel } from "@/components/PatientViewModels/Notes/NotesViewModel";
import Patient from "@/models/patient";

// Define the types for our data
interface PatientInfo {
    patientName: string;
    age: string;
    gender: string;
    dob: Date;
    phoneNumber: string;
    patientID: string;
}

interface LabVisit {
    date: string
    description: string
}

interface Note {
    date: string
    content: string
}

interface Image {
    url: string
    description: string
}

interface Medication {
    name: string
    dosage: string
}

// Define the context structure
interface PatientDashboardContextType {
    activeTab: string
    setActiveTab: (tab: string) => void
    patientInfo: PatientInfo | null
    labVisits: LabVisit[]
    notes: Note[]
    images: Image[]
    medications: Medication[]
    loadingPatientInfo: boolean
    loadingLabVisits: boolean
    loadingNotes: boolean
    loadingImages: boolean
    loadingMedications: boolean
    fetchPatientInfo: () => Promise<void>
    fetchLabVisits: () => Promise<void>
    fetchNotes: () => Promise<void>
    fetchImages: () => Promise<void>
    fetchMedications: () => Promise<void>

    patientViewModel: PatientInfoViewModel | null;
    notesViewModel: NotesViewModel | null;
    isExpanded: boolean;
    toggleExpand: () => void;
}

const PatientContext = createContext<PatientDashboardContextType | undefined>(undefined)

export const usePatientDashboard = () => {
    const context = useContext(PatientContext)
    if (!context) {
        throw new Error("usePatientDashboard must be used within PatientDashboardProvider")
    }
    return context
}

export const PatientDashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { id } = useParams() as { id: string }
    const [activeTab, setActiveTab] = useState('patient-info')
    const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null)
    const [patientViewModel, setPatientViewModel] = useState<PatientInfoViewModel | null>(null);
    const [notesViewModel, setNotesViewModel] = useState<NotesViewModel | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };

    const loadPatientInfo = (patientData: Patient) => {
        const viewModel = new PatientInfoViewModel(patientData);
        setPatientViewModel(viewModel);
    };

    const [labVisits, setLabVisits] = useState<LabVisit[]>([])
    const [notes, setNotes] = useState<Note[]>([])
    const [images, setImages] = useState<Image[]>([])
    const [medications, setMedications] = useState<Medication[]>([])

    const [loadingPatientInfo, setLoadingPatientInfo] = useState(false)
    const [loadingLabVisits, setLoadingLabVisits] = useState(false)
    const [loadingNotes, setLoadingNotes] = useState(false)
    const [loadingImages, setLoadingImages] = useState(false)
    const [loadingMedications, setLoadingMedications] = useState(false)

    const fetchPatientInfo = useCallback(async () => {
        setLoadingPatientInfo(true)
        try {
            const response = await fetch(`/api/patient/${id}`)
            const data = await response.json()
            setPatientInfo({
                patientName: `${data.firstName} ${data.lastName}`,
                age: data.age,
                gender: data.genderPreference,
                dob: new Date(data.dob),
                phoneNumber: data.phone,
                patientID: data._id,
            })
            loadPatientInfo(data);
            setNotesViewModel(new NotesViewModel(data._id, 'currentUser')); // Replace 'currentUser' with actual username
        } catch (error) {
            console.error('Error fetching patient info:', error)
        } finally {
            setLoadingPatientInfo(false)
        }
    }, [id])

    const fetchLabVisits = useCallback(async () => {
        setLoadingLabVisits(true)
        try {
            const response = await fetch(`/api/patients/${id}/lab-visits`)
            const data = await response.json()
            setLabVisits(data)
        } catch (error) {
            console.error('Error fetching lab visits:', error)
        } finally {
            setLoadingLabVisits(false)
        }
    }, [id])

    const fetchNotes = useCallback(async () => {
        setLoadingNotes(true)
        try {
            const response = await fetch(`/api/patients/${id}/notes`)
            const data = await response.json()
            setNotes(data)
        } catch (error) {
            console.error('Error fetching notes:', error)
        } finally {
            setLoadingNotes(false)
        }
    }, [id])

    const fetchImages = useCallback(async () => {
        setLoadingImages(true)
        try {
            const response = await fetch(`/api/patients/${id}/images`)
            const data = await response.json()
            setImages(data)
        } catch (error) {
            console.error('Error fetching images:', error)
        } finally {
            setLoadingImages(false)
        }
    }, [id])

    const fetchMedications = useCallback(async () => {
        setLoadingMedications(true)
        try {
            const response = await fetch(`/api/patients/${id}/medications`)
            const data = await response.json()
            setMedications(data)
        } catch (error) {
            console.error('Error fetching medications:', error)
        } finally {
            setLoadingMedications(false)
        }
    }, [id])

    return (
        <PatientContext.Provider
            value={{
                activeTab,
                setActiveTab,
                patientInfo,
                patientViewModel,
                notesViewModel,
                isExpanded,
                toggleExpand,

                labVisits,
                notes,
                images,
                medications,
                loadingPatientInfo,
                loadingLabVisits,
                loadingNotes,
                loadingImages,
                loadingMedications,
                fetchPatientInfo,
                fetchLabVisits,
                fetchNotes,
                fetchImages,
                fetchMedications,
            }}
        >
            {children}
        </PatientContext.Provider>
    )
}