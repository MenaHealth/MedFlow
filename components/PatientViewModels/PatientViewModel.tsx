import React, { useState, useEffect } from 'react';
import { PatientDashboardProvider, usePatientDashboard } from './PatientViewModelContext';
import { User, FileText, LoaderPinwheel, PanelTopOpen, PillBottle } from 'lucide-react';
import PatientInfoView from './patient-info/PatientInfoView';
import { CombinedNotesView } from './../../components/PatientViewModels/PatientNotes/CombinedNotesView';
import { Skeleton } from './../../components/ui/skeleton';
import MedicationsView from './Medications/MedicationsView';
import ImageGallery from './image-gallery/ImageGallery';

const PatientDashboardContent: React.FC = () => {
    const {
        patientViewModel,
        loadingPatientInfo,
        fetchPatientData,
        isExpanded,
        toggleExpand,
        rxOrders,
        medOrders,
        loadingMedications,
        refreshMedications,
        userSession,
    } = usePatientDashboard();

    const [openSections, setOpenSections] = useState<string[]>(['patient-info']);

    useEffect(() => {
        fetchPatientData();
    }, [fetchPatientData]);

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
    };

    const renderSectionContent = (section: string) => {
        if (section === 'patient-info') {
            if (!patientViewModel || loadingPatientInfo) {
                return null;
            }
            return isExpanded ? <PatientInfoView isExpanded={isExpanded} /> : null;
        } else if (section === 'notes') {
            return <CombinedNotesView patientId={patientViewModel?.getPrimaryDetails().patientID || ''} />;
        } else if (section === 'medications') {
            return <MedicationsView
                patientId={patientViewModel?.getPrimaryDetails().patientID || ''}
            />
        } else if (section === 'images') {
            return <ImageGallery />;
        }
    };

    const sections = [
        {
            id: 'patient-info',
            icon: User,
            label: 'Patient Info',
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
        {
            id: 'medications',
            icon: PillBottle,
            label: 'Medications',
            color: 'bg-orange-900',
            textColor: 'text-orange-50'
        },
        {
            id: 'images',
            icon: PanelTopOpen,
            label: 'Images',
            color: 'bg-darkBlue',
            textColor: 'text-orange-50'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8 overflow-hidden">
            <div className="space-y-4">
                {sections.map((section) => (
                    <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div
                            className={`flex justify-between items-center cursor-pointer p-4 ${section.color}`}
                            onClick={() => toggleSection(section.id)}
                        >
                            <div className="flex items-center">
                                {section.id === 'patient-info' && loadingPatientInfo ? (
                                    <LoaderPinwheel className={`w-6 h-6 mr-2 ${section.textColor} animate-spin`} />
                                ) : (
                                    <section.icon className={`w-6 h-6 mr-2 ${section.textColor}`} />
                                )}
                                <h2 className={`text-2xl font-semibold ${section.textColor}`}>
                                    {section.id === 'patient-info' ? (
                                        !patientViewModel || loadingPatientInfo ? (
                                            <Skeleton className="w-32 h-8" />
                                        ) : (
                                            patientViewModel.getPrimaryDetails().patientName
                                        )
                                    ) : (
                                        section.label
                                    )}
                                </h2>
                            </div>
                            <span
                                className={`transform transition-transform ${
                                    openSections.includes(section.id) ? 'rotate-180' : ''
                                } ${section.textColor}`}
                            >
                                <PanelTopOpen />
                            </span>
                        </div>
                        {openSections.includes(section.id) && (
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'border-t border-gray-200' : ''}`}>
                                <div className={`p-0 bg-transparent`}>
                                    {renderSectionContent(section.id)}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const PatientViewModel: React.FC = () => (
    <PatientDashboardProvider>
        <PatientDashboardContent />
    </PatientDashboardProvider>
);

export default PatientViewModel;