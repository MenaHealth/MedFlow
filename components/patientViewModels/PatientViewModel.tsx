// components/patientViewModels/PatientViewModel
import React, { useState, useEffect } from 'react';
import { PatientDashboardProvider, usePatientDashboard } from './PatientViewModelContext';
import { User, FileText, LoaderPinwheel, PanelTopOpen, PillBottle, MessageCircle, ImageIcon, VideoIcon } from 'lucide-react';
import PatientInfoView from './patient-info/PatientInfoView';
import { CombinedNotesView } from '@/components/patientViewModels/PatientNotes/CombinedNotesView';
import { Skeleton } from '@/components/ui/skeleton';
import MedicationsView from './Medications/MedicationsView';
import ImageGallery from './image-gallery/ImageGallery';
import TelegramMessagesDoctorView from '@/components/patientViewModels/telegram-messages/TelegramMessagesDoctorView';
import { CircleLoader } from 'react-spinners';

import dynamic from 'next/dynamic';

const AppBuilderWrapper = dynamic(
    () => import('@/components/patientViewModels/videocall/AppBuilderWrapper'),
    {
        ssr: false,
        loading: () => (
            <div className='w-full h-full flex flex-col justify-center items-center'>
                <div>Please wait, this could take a minute or two...</div>
                <CircleLoader color="#FF5722" />
            </div>
        )
    }
);

const PatientDashboardContent: React.FC = () => {
    const {
        patientInfo, // Ensure this contains the telegramChatId
        patientViewModel,
        loadingPatientInfo,
        fetchPatientData,
        isExpanded,
        toggleExpand,
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
            return <MedicationsView patientId={patientViewModel?.getPrimaryDetails().patientID || ''} />;
        } else if (section === 'images') {
            return <ImageGallery />;
        } else if (section === 'contact') {
            return (
                <div className="bg-gradient-to-b from-orange-500 to-white h-full">
                    {patientInfo?.telegramChatId ? (
                        <TelegramMessagesDoctorView telegramChatId={patientInfo.telegramChatId} />
                    ) : (
                        <div className="flex justify-center items-center h-64">
                            <CircleLoader color="#FF5722" />
                        </div>
                    )}
                </div>
            );
        } else if (section === 'video') {
            return <AppBuilderWrapper />
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
            color: 'bg-orange-950',
            textColor: 'text-white'
        },
        {
            id: 'images',
            icon: ImageIcon,
            label: 'Images',
            color: 'bg-grey-100',
            textColor: 'text-darkBlue'
        },
        {
            id: 'contact',
            icon: MessageCircle,
            label: 'Contact',
            color: 'bg-orange-500',
            textColor: 'text-white'
        },
        {
            id: 'video',
            icon: VideoIcon,
            label: 'Video',
            color: 'bg-blue-500',
            textColor: 'text-white'
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
                                            patientViewModel.getPrimaryDetails()?.patientName || "Patient Info"
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
