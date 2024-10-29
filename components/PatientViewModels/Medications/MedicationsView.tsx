// components/PatientViewModels/Medications/MedicationsView.tsx

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RadioCard } from '@/components/ui/radio-card';
import { ScrollArea } from '@/components/form/ScrollArea';
import RXOrderView from './rx/RXOrderView';
import MedOrderView from '@/components/PatientViewModels/Medications/med/MedOrderView';
import PreviousMedicationsView from './previous/PreviousMedicationsView';
import { Resizable } from '@/components/ui/Resizable';
import { useRXOrderViewModel } from '@/components/PatientViewModels/Medications/rx/RXOrderViewModel';
import { useMedOrderViewModel } from '@/components/PatientViewModels/Medications/med/MedOrderViewModel';
import { usePatientDashboard } from '@/components/PatientViewModels/PatientViewModelContext';
import { BarLoader } from "react-spinners";
import { DoctorSpecialtyList } from "@/data/doctorSpecialty.enum";
import { ChevronUp, ChevronDown } from 'lucide-react'

interface MedicationsViewProps {
    patientId: string;
}

export default function MedicationsView({ patientId }: MedicationsViewProps) {
    const {
        userSession,
        rxOrders,
        medOrders,
        loadingMedications,
        patientInfo,
    } = usePatientDashboard();

    const [templateType, setTemplateType] = useState<'rxOrder' | 'medOrder'>('rxOrder');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isExpanded, setIsExpanded] = useState(userSession?.accountType === 'Triage' || !isMobile);

    const methods = useForm({
        defaultValues: templateType === 'rxOrder' ? { rxOrder: rxOrders } : { medOrder: medOrders },
    });

    const { submitRxOrder, isLoading: rxLoading } = useRXOrderViewModel(
        patientId,
        () => {}, // Placeholder for onNewRxOrderSaved
        patientInfo?.city || ''
    );

    const { submitMedOrder, isLoading: medLoading } = useMedOrderViewModel(
        patientId,
        patientInfo?.patientName || '',
        patientInfo?.city || ''
    );

    const handleCreateMedication = async () => {
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
        window.addEventListener('resize', handleScreenResize);
        return () => {
            window.removeEventListener('resize', handleScreenResize);
        };
    }, []);

    if (loadingMedications) {
        return (
            <div className="flex items-center justify-center h-[100vh] text-white bg-orange-950">
                <BarLoader color="#ffffff" />
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleCreateMedication)}>
                <div className="flex flex-col md:flex-row h-[100vh] overflow-hidden bg-orange-950">
                    {
                        (isMobile || userSession?.accountType === 'Triage') ? (
                            <Card className="w-full">
                                {userSession?.accountType === "Doctor" && (
                                    <CardHeader
                                        className="px-4 py-2 flex justify-between items-center cursor-pointer"
                                        onClick={() => setIsExpanded(!isExpanded)}
                                    >
                                        <h3 className="text-lg font-semibold">Previous Medications</h3>
                                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                    </CardHeader>
                                )}
                                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[50vh]' : 'max-h-0'}`}>
                                    <ScrollArea className="h-[50vh] w-full bg-orange-950">
                                        <PreviousMedicationsView
                                            rxOrders={rxOrders}
                                            medOrders={medOrders}
                                            loadingMedications={loadingMedications}
                                        />
                                    </ScrollArea>
                                </div>
                            </Card>
                        ) : (
                            <Resizable
                                className="hidden md:block"
                                minWidth={200}
                                maxWidth={800}
                                defaultWidth={400}
                            >
                                <Card className="h-full">
                                    <CardHeader className="px-4 py-2">
                                        <h3 className="text-lg font-semibold text-white text-center rounded-lg p-2 bg-orange-950 border-b-2 border-white">
                                            Previous Medications
                                        </h3>
                                    </CardHeader>
                                    <CardContent className="h-full p-0">
                                        <ScrollArea className="h-full w-full">
                                            <PreviousMedicationsView
                                                rxOrders={rxOrders}
                                                medOrders={medOrders}
                                                loadingMedications={loadingMedications}
                                            />
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </Resizable>
                        )
                    }

                    <Card className="flex-grow h-full md:h-auto overflow-hidden">
                        <CardHeader className="px-4 py-2">
                            <RadioCard.Root
                                defaultValue={templateType}
                                onValueChange={handleValueChange}
                                className="flex w-full"
                            >
                                <RadioCard.Item value="rxOrder" className={`flex-1 ${templateType === 'rxOrder' ? 'border-2 border-orange-500' : 'border border-gray-200'}`}>
                                    Rx Order
                                </RadioCard.Item>
                                <RadioCard.Item value="medOrder" className={`flex-1 ${templateType === 'medOrder' ? 'border-2 border-orange-500' : 'border border-gray-200'}`}>
                                    Medication Order
                                </RadioCard.Item>
                            </RadioCard.Root>
                        </CardHeader>
                        <CardContent className="h-full p-0">
                            <ScrollArea className="h-full w-full pb-16">
                                <div className="mt-4 p-4">
                                    {templateType === 'rxOrder' && (
                                        <RXOrderView
                                            user={{
                                                firstName: userSession?.firstName || '',
                                                lastName: userSession?.lastName || '',
                                                doctorSpecialty: (userSession?.doctorSpecialty as keyof typeof DoctorSpecialtyList) || 'NOT_SELECTED',
                                            }}
                                            patientId={patientId}
                                            patientInfo={patientInfo || { patientName: '', phoneNumber: '', age: '', city: '' }}
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
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </FormProvider>
    );
}