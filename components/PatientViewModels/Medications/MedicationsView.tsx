// components/PatientViewModels/Medications/MedicationsView.tsx
import React, {useEffect, useState} from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { Button } from './../../../components/ui/button';
import { Card, CardContent, CardHeader } from './../../../components/ui/card';
import { RadioCard } from './../../../components/ui/radio-card';
import { ScrollArea } from './../../../components/form/ScrollArea';
import { ChevronDown, ChevronUp } from 'lucide-react';
import RXOrderView from './rx/RXOrderView';
import MedOrderView from './../../../components/PatientViewModels/Medications/med/MedOrderView';
import PreviousMedicationsView from './previous/PreviousMedicationsView';
import { Resizable } from './../../../components/ui/Resizable';
import { useRXOrderViewModel } from './../../../components/PatientViewModels/Medications/rx/RXOrderViewModel';
import { useMedOrderRequestViewModel } from './../../../components/PatientViewModels/Medications/med/MedOrderViewModel';
import { ClipLoader } from 'react-spinners';

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
        fetchPatientData,
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

    const patientDetails = patientViewModel?.getPrimaryDetails() || { patientName: '', patientID: '' };
    const expandedDetails = patientViewModel?.getExpandedDetails();

    const [previousMedicationsWidth, setPreviousMedicationsWidth] = useState(400);
    const [templateType, setTemplateType] = useState<'rxOrder' | 'medicalrequest'>('rxOrder');

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

    useEffect(() => {
        if (!rxOrders.length && !medOrders.length && !loadingMedications) {
            fetchPatientData();
        }
    }, [rxOrders, medOrders, fetchPatientData, loadingMedications]);

    // Show loader if data is loading
    if (loadingMedications) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader size={50} color="orange-500" loading={true} />
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleCreateMedication)}>
                <div className="flex flex-col md:flex-row h-[100vh] bg-darkBlue overflow-hidden">
                    <Resizable
                        className="hidden md:block"
                        minWidth={200}
                        maxWidth={800}
                        defaultWidth={400}
                        onResize={handleResize}
                    >
                        <Card className="h-full">
                            <ScrollArea className="h-full w-full">
                                <CardHeader className="px-4 py-2">
                                    <h3 className="text-lg font-semibold">Previous Medications</h3>
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
                                                phone: expandedDetails?.phone ?? '',
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
                                                phone: expandedDetails?.phone ?? '',
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