// components/PatientViewModels/Medications/MedicationsView.tsx

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { RadioCard } from '@/components/ui/radio-card';
import RXOrderView from './rx/RXOrderView';
import MedOrderView from '@/components/PatientViewModels/Medications/med/MedOrderView';
import PreviousMedicationsView from './previous/PreviousMedicationsView';
import RxOrderDrawerView from './rx/RxOrderDrawerView';
import { useRXOrderViewModel } from '@/components/PatientViewModels/Medications/rx/RXOrderViewModel';
import { useMedOrderViewModel } from '@/components/PatientViewModels/Medications/med/MedOrderViewModel';
import { usePatientDashboard } from '@/components/PatientViewModels/PatientViewModelContext';
import { BarLoader } from "react-spinners";
import { DoctorSpecialtyList } from "@/data/doctorSpecialty.enum";
import { ChevronDown, ChevronUp, Share } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { IRxOrder } from '@/models/patient';
import { IMedOrder } from '@/models/medOrder';
import {Types} from "mongoose";

interface MedicationsViewProps {
    patientId: string;
}

export default function MedicationsView({ patientId }: MedicationsViewProps) {
    const medOrderPatientId = new Types.ObjectId(patientId);

    const {
        userSession,
        rxOrders,
        medOrders,
        loadingMedications,
        patientInfo,
    } = usePatientDashboard();

    const [templateType, setTemplateType] = useState<'rxOrder' | 'medOrder'>('rxOrder');
    const [isMobile, setIsMobile] = useState(false);
    const [showAllMedications, setShowAllMedications] = useState(false);
    const [isLatestExpanded, setIsLatestExpanded] = useState(false);
    const [isShareDrawerOpen, setIsShareDrawerOpen] = useState(false);
    const [selectedRxOrder, setSelectedRxOrder] = useState<IRxOrder | null>(null);

    const handleOpenShareDrawer = (rxOrder: IRxOrder) => {
        setSelectedRxOrder(rxOrder);
        setIsShareDrawerOpen(true);
    };

    const methods = useForm({
        defaultValues: templateType === 'rxOrder' ? { rxOrder: rxOrders } : { medOrder: medOrders },
    });

    const allMedications = React.useMemo(() => {
        return [...rxOrders, ...medOrders].sort((a, b) => {
            const dateA = new Date('prescribedDate' in a ? a.prescribedDate : a.orderDate);
            const dateB = new Date('prescribedDate' in b ? b.prescribedDate : b.orderDate);
            return dateB.getTime() - dateA.getTime();
        });
    }, [rxOrders, medOrders]);

    const latestMedication = allMedications[0];
    const isRxOrder = latestMedication && 'prescriptions' in latestMedication;

    const { submitRxOrder, isLoading: rxLoading } = useRXOrderViewModel(
        medOrderPatientId,
        () => {}, // Placeholder for onNewRxOrderSaved
        patientInfo?.city || '',
        patientInfo?.patientName || ''
    );

    const { submitMedOrder, isLoading: medLoading } = useMedOrderViewModel(
        patientId,
        patientInfo?.patientName || '',
        patientInfo?.city || ''
    );

    const handleCreateMedication = async (event: React.FormEvent) => {
        event.preventDefault();
        if (templateType === 'rxOrder') {
            await submitRxOrder();
        } else {
            await submitMedOrder();
        }
    };

    const handleValueChange = (value: 'rxOrder' | 'medOrder') => {
        if (value !== templateType) {
            setTemplateType(value);
            methods.reset(value === 'rxOrder' ? { rxOrder: rxOrders } : { medOrder: medOrders });
        }
    };

    const handleScreenResize = () => {
        setIsMobile(window.innerWidth < 768);
    };

    useEffect(() => {
        handleScreenResize();
        window.addEventListener('resize', handleScreenResize);
        return () => {
            window.removeEventListener('resize', handleScreenResize);
        };
    }, []);

    const toggleAllMedications = (event: React.MouseEvent) => {
        event.preventDefault();
        setShowAllMedications(!showAllMedications);
    };

    const toggleLatestExpanded = (event: React.MouseEvent) => {
        event.preventDefault();
        setIsLatestExpanded(!isLatestExpanded);
    };

    if (loadingMedications) {
        return (
            <div className="flex items-center justify-center h-[100vh] text-white bg-orange-950" aria-live="polite">
                <BarLoader color="#ffffff" />
                <span className="sr-only">Loading medications...</span>
            </div>
        );
    }

    const isDoctor = userSession?.accountType === 'Doctor';
    const isTriage = userSession?.accountType === 'Triage';

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleCreateMedication}>
                <div className="flex flex-col h-[100vh] overflow-hidden bg-orange-950">
                    <div className="flex-grow overflow-auto border-t-2 border-white rounded-lg">
                        {!isTriage && latestMedication && (
                            <div className="p-4 border-b border-b-2 border-white rounded-lg">
                                <div className="text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={toggleLatestExpanded}
                                                className="text-white border-white border-2 pt-0.5 pl-2 pr-2 rounded-full hover:text-orange-950 hover:bg-white transition-colors"
                                                aria-expanded={isLatestExpanded}
                                                type="button"
                                            >
                                                {isLatestExpanded ? <ChevronUp className="h-5 w-5"/> :
                                                    <ChevronDown className="h-5 w-5"/>}
                                            </button>
                                            <div className="inline-block p-2 mb-2">
                                            Latest:
                                            </div>
                                            <div className="inline-block border-2 border-white p-2 rounded mb-2">
                                               {isRxOrder ? 'Rx Order' : 'Medical Order'}
                                            </div>
                                        </div>
                                        {isRxOrder && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenShareDrawer(latestMedication as IRxOrder)}
                                            >
                                                <Share/>
                                                <span className="sr-only">Share Rx Order</span>
                                            </Button>
                                        )}
                                    </div>
                                    <p>{new Date(isRxOrder ? latestMedication.prescribedDate : latestMedication.orderDate).toLocaleDateString()}</p>
                                    <p className="text-center">Dr. {latestMedication.prescribingDr}</p>

                                    {isLatestExpanded && (
                                        <div className="mt-2 p-2 bg-white text-darkBlue rounded-sm">
                                            <p>
                                                <strong>City:</strong> {isRxOrder ? latestMedication.city : latestMedication.patientCity}
                                            </p>
                                            {isRxOrder && <p><strong>Valid
                                                Till:</strong> {new Date(latestMedication.validTill).toLocaleDateString()}
                                            </p>}
                                            <h4 className="mt-2 font-bold">{isRxOrder ? 'Prescriptions:' : 'Medications:'}</h4>
                                            {isRxOrder ? (
                                                (latestMedication as IRxOrder).prescriptions.map((med, medIndex) => (
                                                    <div key={`latest-med-${medIndex}`}
                                                         className="mt-2 p-2 bg-gray-100 rounded-sm">
                                                        <p><strong>Diagnosis:</strong> {med.diagnosis}</p>
                                                        <p><strong>Medication:</strong> {med.medication}</p>
                                                        <p><strong>Dosage:</strong> {med.dosage}</p>
                                                        <p><strong>Frequency:</strong> {med.frequency}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                (latestMedication as IMedOrder).medications.map((med, medIndex) => (
                                                    <div key={`latest-med-${medIndex}`}
                                                         className="mt-2 p-2 bg-gray-100 rounded-sm">
                                                        <p><strong>Diagnosis:</strong> {med.diagnosis}</p>
                                                        <p><strong>Medication:</strong> {med.medication}</p>
                                                        <p><strong>Dosage:</strong> {med.dosage}</p>
                                                        <p><strong>Frequency:</strong> {med.frequency}</p>
                                                        <p><strong>Quantity:</strong> {med.quantity}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {!isTriage && (
                            <div className="sticky bottom-0 w-full p-4 bg-orange-950 border-t border-white/10">
                                <Button
                                    variant="outline"
                                    className="w-full bg-white text-orange-950 border-white hover:bg-orange-800 hover:text-white border-2 transition-colors pt-4 pb-4"
                                    onClick={toggleAllMedications}
                                    type="button"
                                >
                                    {showAllMedications ? (
                                        <>
                                            <ChevronUp className="mr-2 h-4 w-4"/>
                                            Hide previous medications
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="mr-2 h-4 w-4"/>
                                            All previous medications
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        <div
                            className={`transition-all duration-300 ${showAllMedications ? 'h-full' : 'h-0 overflow-hidden'}`}>
                            <PreviousMedicationsView
                                rxOrders={rxOrders}
                                medOrders={medOrders}
                                loadingMedications={loadingMedications}
                                isMobile={isMobile}
                                isDoctor={isDoctor}
                            />
                        </div>

                        {!showAllMedications && (
                            <div className="p-4">
                                {isDoctor && (
                                    <>
                                        <RadioCard.Root
                                            defaultValue={templateType}
                                            onValueChange={handleValueChange}
                                            className="flex w-full mb-4"
                                        >
                                            <RadioCard.Item value="rxOrder"
                                                            className={`flex-1 ${templateType === 'rxOrder' ? 'border-2 border-white bg-white text-orange-950' : 'border-2 border-white text-white hover:bg-orange-800 transition-colors'}`}>
                                                Rx Order
                                            </RadioCard.Item>
                                            <RadioCard.Item value="medOrder"
                                                            className={`flex-1 ${templateType === 'medOrder' ? 'border-2 border-white bg-white text-orange-950' : 'border-2 border-white text-white hover:bg-orange-800 transition-colors'}`}>
                                                Medication Order
                                            </RadioCard.Item>
                                        </RadioCard.Root>

                                        {templateType === 'rxOrder' && (
                                            <RXOrderView
                                                user={{
                                                    firstName: userSession?.firstName || '',
                                                    lastName: userSession?.lastName || '',
                                                    doctorSpecialty: (userSession?.doctorSpecialty as keyof typeof DoctorSpecialtyList) || 'NOT_SELECTED',
                                                }}
                                                patientId={patientId}
                                                patientInfo={{
                                                    patientName: patientInfo?.patientName || '',
                                                    phoneNumber: patientInfo?.phone?.phoneNumber || '',
                                                    age: patientInfo?.age || '',
                                                    city: patientInfo?.city || ''
                                                }}
                                            />
                                        )}
                                        {templateType === 'medOrder' && (
                                            <MedOrderView
                                                patientId={patientId}
                                                user={{
                                                    firstName: userSession?.firstName || '',
                                                    lastName: userSession?.lastName || '',
                                                    doctorSpecialty: (userSession?.doctorSpecialty as keyof typeof DoctorSpecialtyList) || 'NOT_SELECTED',
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                                {isTriage && (
                                    <PreviousMedicationsView
                                        rxOrders={rxOrders}
                                        medOrders={medOrders}
                                        loadingMedications={loadingMedications}
                                        isMobile={isMobile}
                                        isDoctor={isDoctor}
                                    />
                                )}
                                {!isDoctor && !isTriage && (
                                    <p className="text-white mb-4">You do not have permission to view or place medication orders.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </form>
            <RxOrderDrawerView
                isOpen={isShareDrawerOpen}
                onClose={() => setIsShareDrawerOpen(false)}
                rxOrder={selectedRxOrder}
                patientId={patientId}
            />
        </FormProvider>
    );
}