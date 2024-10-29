// components/PatientViewModels/Medications/MedicationsView.tsx

import React, { useState } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { Card, CardContent, CardHeader } from './../../../components/ui/card';
import { RadioCard } from './../../../components/ui/radio-card';
import { ScrollArea } from './../../../components/form/ScrollArea';
import RXOrderView from './rx/RXOrderView';
import MedOrderView from './../../../components/PatientViewModels/Medications/med/MedOrderView';
import PreviousMedicationsView from './previous/PreviousMedicationsView';
import { Resizable } from './../../../components/ui/Resizable';
import { useRXOrderViewModel } from './../../../components/PatientViewModels/Medications/rx/RXOrderViewModel';
import { useMedOrderViewModel } from './../../../components/PatientViewModels/Medications/med/MedOrderViewModel';
import { usePatientDashboard } from './../../../components/PatientViewModels/PatientViewModelContext';
import { BarLoader } from "react-spinners";

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

    const { submitRxOrder, isLoading: rxLoading } = useRXOrderViewModel(patientId);
    const { submitMedOrder, isLoading: medLoading } = useMedOrderViewModel(patientId);

    const [templateType, setTemplateType] = useState<'rxOrder' | 'medOrder'>('rxOrder');

    const methods = useForm({
        defaultValues: templateType === 'rxOrder' ? { rxOrder: rxOrders } : { medOrder: medOrders },
    });

    const handleCreateMedication = async () => {
        if (templateType === 'rxOrder') {
            await submitRxOrder();
        } else {
            await submitMedOrder();
        }
    };

    // Check if data is still loading
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
                <div className="flex flex-col md:flex-row h-[100vh] overflow-hidden">
                    <Resizable
                        className="hidden md:block"
                        minWidth={200}
                        maxWidth={800}
                        defaultWidth={400}
                    >
                        <Card className="h-full">
                            <ScrollArea className="h-full w-full bg-orange-950">
                                <CardHeader className="px-4 py-2">
                                    <h3 className="text-lg font-semibold bg-orange-950 text-white text-center rounded-lg p-2 border-b-2 border-white">
                                        Previous Medications
                                    </h3>
                                </CardHeader>
                                <CardContent className="h-full p-0">
                                    <PreviousMedicationsView
                                        rxOrders={rxOrders}
                                        medOrders={medOrders}
                                        loadingMedications={loadingMedications}
                                    />
                                </CardContent>
                            </ScrollArea>
                        </Card>
                    </Resizable>

                    <Card className="flex-grow h-full md:h-auto overflow-hidden">
                        <CardHeader className="px-4 py-2">
                            <RadioCard.Root
                                defaultValue={templateType}
                                onValueChange={(value) => setTemplateType(value as 'rxOrder' | 'medOrder')}
                                className="flex w-full"
                            >
                                <RadioCard.Item value="rxOrder" className={`flex-1 ${templateType === 'rxOrder' ? 'bg-white' : ''}`}>
                                    Rx Order
                                </RadioCard.Item>
                                <RadioCard.Item value="medOrder" className={`flex-1 ${templateType === 'medOrder' ? 'bg-white' : ''}`}>
                                    Medication Order
                                </RadioCard.Item>
                            </RadioCard.Root>
                        </CardHeader>
                        <CardContent className="h-full p-0">
                            <ScrollArea className="h-full w-full pb-16 bg-orange-950">
                                <div className="mt-4 p-4">
                                    {templateType === 'rxOrder' && (
                                        <RXOrderView
                                            user={{
                                                firstName: userSession?.firstName || '',
                                                lastName: userSession?.lastName || '',
                                                doctorSpecialty: userSession?.doctorSpecialty as keyof typeof DoctorSpecialtyList || 'NOT_SELECTED',
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
                                                doctorSpecialty: userSession?.doctorSpecialty as keyof typeof DoctorSpecialtyList || 'NOT_SELECTED',
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