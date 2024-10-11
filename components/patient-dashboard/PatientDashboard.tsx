// components/patient-dashboard/PatientDashboard.tsx
import React, { useState, useEffect } from 'react'
import { PatientDashboardProvider, usePatientDashboard } from './PatientDashboardContext'
import { User, FileText, ListRestart } from 'lucide-react'
import { BarLoader } from 'react-spinners'
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import PatientInfoView from './patient-info/PatientInfoView'
import { NotesView } from './notes/NotesView'

const PatientDashboardContent: React.FC = () => {
    const {
        patientViewModel,
        loadingPatientInfo,
        fetchPatientInfo,
        isExpanded,
        toggleExpand,
    } = usePatientDashboard()

    const [openSections, setOpenSections] = useState<string[]>(['patient-info'])

    useEffect(() => {
        fetchPatientInfo()
    }, [fetchPatientInfo])

    const toggleSection = (section: string) => {
        if (openSections.includes(section)) {
            if (section === 'patient-info') {
                toggleExpand();
            } else {
                setOpenSections(prev => prev.filter(s => s !== section));
            }
        } else {
            setOpenSections(prev => [...prev, section]);
        }
    }

    const renderSectionContent = (section: string) => {
        if (section === 'patient-info') {
            return loadingPatientInfo ? (
                <BarLoader color="var(--orange-500)" />
            ) : patientViewModel ? (
                <PatientInfoView viewModel={patientViewModel} isExpanded={isExpanded} />
            ) : (
                <p>No patient information available.</p>
            )
        } else if (section === 'notes') {
            return <NotesView patientId={patientViewModel?.getPrimaryDetails().patientID || ''} username="currentUser" />
        }
        return null
    }

    const sections = [
        {
            id: 'patient-info',
            icon: User,
            label: patientViewModel?.getPrimaryDetails().patientName || 'Patient Info',
            color: 'bg-orange-50',
            textColor: 'text-orange-500'
        },
        {
            id: 'notes',
            icon: FileText,
            label: 'Notes',
            color: 'bg-darkBlue',
            textColor: 'text-orange-50'
        },
    ]

    return (
        <div className="container mx-auto px-4 py-8 overflow-hidden">
            {/*<div className="flex justify-between items-center mb-8">*/}
            {/*    <button*/}
            {/*        className="text-orange-500 hover:border-orange-500 border-transparent border-2 py-2 px-4 rounded focus:outline-none focus:border-orange-500"*/}
            {/*        onClick={() => fetchPatientInfo()}*/}
            {/*    >*/}
            {/*        <ListRestart/>*/}
            {/*    </button>*/}
            {/*</div>*/}
            <div className="space-y-4">
                {sections.map((section) => (
                    <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div
                            className={`flex justify-between items-center cursor-pointer p-4 ${section.color}`}
                            onClick={() => toggleSection(section.id)}
                        >
                            <div className="flex items-center">
                                <section.icon className={`w-6 h-6 mr-2 ${section.textColor}`}/>
                                <h2 className={`text-2xl font-semibold ${section.textColor}`}>{section.label}</h2>
                            </div>
                            <span
                                className={`transform transition-transform ${openSections.includes(section.id) ? 'rotate-180' : ''} ${section.textColor}`}>▼</span>
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                openSections.includes(section.id) ? 'max-h-[1000px]' : 'max-h-0'
                            }`}
                        >
                            <div className={`p-4 ${section.color}`}>
                                {renderSectionContent(section.id)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const PatientDashboard: React.FC = () => (
    <PatientDashboardProvider>
        <PatientDashboardContent/>
    </PatientDashboardProvider>
)

export default PatientDashboard