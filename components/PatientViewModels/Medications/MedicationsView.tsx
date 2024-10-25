// components/PatientViewModels/Medications/MedicationsView.tsx
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { Button } from './../../../components/ui/button';
import { Card, CardContent, CardHeader } from './../../../components/ui/card';
import { RadioCard } from './../../../components/ui/radio-card';
import { ScrollArea } from './../../../components/form/ScrollArea';
import { ChevronDown, ChevronUp } from 'lucide-react';
import RXOrderView from './rx/RXOrderView';
import MedOrderView from './medX/MedOrderView';
import PreviousMedicationsView from './previous/PreviousMedicationsView';
import { Resizable } from './../../../components/ui/Resizable';
import { useRXOrderViewModel } from './../../../components/PatientViewModels/Medications/rx/RXOrderViewModel';
import { useMedOrderRequestViewModel } from './../../../components/PatientViewModels/Medications/medX/MedOrderViewModel';
import { useSession } from 'next-auth/react';

import { usePatientDashboard } from './../../PatientViewModels/PatientViewModelContext';

interface MedicationsViewProps {
    patientId: string;
}

export default function MedicationsView({ patientId }: MedicationsViewProps) {
    const {
        userSession,
        rxOrders,
        medOrders,
        loadingMedications,
        patientViewModel,
    } = usePatientDashboard();

    const {
        rxOrder,
        submitRxOrder,
        isLoading: rxLoading,
    } = useRXOrderViewModel(patientId);

    const {
        medOrder,
        submitMedOrder,
        isLoading: medLoading,
    } = useMedOrderRequestViewModel(patientId);

    const { data: session } = useSession();

    const patientDetails = patientViewModel?.getPrimaryDetails() || { patientName: '', patientID: '' };
    const expandedDetails = patientViewModel?.getExpandedDetails();

    const [previousMedicationsWidth, setPreviousMedicationsWidth] = useState(400);
    const [templateType, setTemplateType] = useState<'rxOrder' | 'medicalrequest'>('rxOrder');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isExpanded, setIsExpanded] = useState((session?.user.accountType === 'Triage' || !isMobile) ? true : false);

    const handleScreenResize = () => {
        if (window.innerWidth < 768) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleScreenResize);
        return () => {
            window.removeEventListener('resize', handleScreenResize);
        };
    }, []);

    const methods = useForm({
        defaultValues: templateType === 'rxOrder' ? rxOrder : medOrder,
    });

    const handleResize = (width: number) => {
        setPreviousMedicationsWidth(width);
    };

    const handleCreateMedication = async (data: any) => {
        if (templateType === 'rxOrder') {
            await submitRxOrder(data);
        } else {
            await submitMedOrder();
        }
    };

    const handleValueChange = (value: 'rxOrder' | 'medicalrequest') => {
        if (value !== templateType) {
            setTemplateType(value);
            methods.reset(value === 'rxOrder' ? rxOrder : medOrder);
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleCreateMedication)}>
                <div className="flex flex-col md:flex-row h-full bg-darkBlue overflow-hidden">
                    {
                        (isMobile || session?.user.accountType === 'Triage') ? (
                            <Card className="w-full">
                        {
                            session?.user?.accountType === "Doctor" && (
                                <CardHeader 
                                    className="px-4 py-2 flex justify-between items-center cursor-pointer"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    <h3 className="text-lg font-semibold">Previous Medications</h3>
                                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                </CardHeader>   
                            )
                        }
                        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[50vh]' : 'max-h-0'}`}>
                            <ScrollArea className="h-[50vh] w-full">
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
                                minWidth={200}
                                maxWidth={800}
                                defaultWidth={400}
                                onResize={handleResize}
                            >
                                <Card className="h-full">
                                    {
                                        session?.user.accountType === 'Doctor' && (
                                            <CardHeader 
                                                className="px-4 py-2 flex justify-between items-center cursor-pointer"
                                                onClick={() => setIsExpanded(!isExpanded)}
                                            >
                                                <h3 className="text-lg font-semibold">Previous Medications</h3>
                                                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                            </CardHeader>
                                        )
                                    }
                                    <CardContent className={`h-full p-0 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[50vh]' : 'max-h-0'}`} >
                                        <PreviousMedicationsView
                                            rxOrders={rxOrders}
                                            medOrders={medOrders}
                                            loadingMedications={loadingMedications}
                                        />
                                    </CardContent>
                                </Card>
                            </Resizable>
                        )
                    }

                    {
                        session?.user.accountType === 'Doctor' && (
                            <Card className="flex-grow h-full md:h-auto overflow-hidden">
                                <CardHeader className="px-4 py-2">
                                    <RadioCard.Root
                                        defaultValue={templateType}
                                        onValueChange={handleValueChange}
                                        className="flex w-full"
                                    >
                                        <RadioCard.Item
                                            value="rxOrder"
                                            className={`flex-1 ${templateType === 'rxOrder' ? 'border-2 border-orange-500' : 'border border-gray-200'}`}
                                        >
                                            Rx Order
                                        </RadioCard.Item>
                                        <RadioCard.Item
                                            value="medicalrequest"
                                            className={`flex-1 ${templateType === 'medicalrequest' ? 'border-2 border-orange-500' : 'border border-gray-200'}`}
                                        >
                                            Medication Order
                                        </RadioCard.Item>
                                    </RadioCard.Root>
                                </CardHeader>
                                <CardContent className="h-full md:h-[calc(100vh-120px)] p-0">
                                    <ScrollArea className="h-full w-full pb-16">
                                        <div className="mt-4 p-4">
                                            {templateType === 'rxOrder' ? (
                                                <RXOrderView
                                                    patientId={patientId}
                                                    user={{
                                                        firstName: userSession?.firstName || '',
                                                        lastName: userSession?.lastName || '',
                                                        doctorSpecialty: userSession?.doctorSpecialty ?? 'NOT_SELECTED',
                                                    }}
                                                    patientDetails={patientDetails || { patientName: '' }}
                                                    expandedDetails={{
                                                        ...expandedDetails,
                                                        phone: `${expandedDetails?.phone?.countryCode || ''} ${expandedDetails?.phone?.phoneNumber || ''}`,
                                                        age: expandedDetails?.age ?? '',
                                                    }}
                                                />
                                            ) : (
                                                <MedOrderView
                                                    patientId={patientId}
                                                    user={{
                                                        firstName: userSession?.firstName || '',
                                                        lastName: userSession?.lastName || '',
                                                        doctorSpecialty: userSession?.doctorSpecialty ?? 'NOT_SELECTED',
                                                    }}
                                                    patientDetails={patientDetails}
                                                    expandedDetails={{
                                                        ...expandedDetails,
                                                        phone: `${expandedDetails?.phone?.countryCode || ''} ${expandedDetails?.phone?.phoneNumber || ''}`,
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        )
                    }
                </div>
            </form>
        </FormProvider>
    );
}