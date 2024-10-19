// components/PatientViewModels/Medications/MedicationsView.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioCard } from "@/components/ui/radio-card";
import { ScrollArea } from '@/components/form/ScrollArea';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMedicationsViewModel } from './MedicationsViewModel';
import RXFormView from './rx/RXFormView';
import MedicalOrderRequestView from './medX/MedicalOrderRequestView';
import PreviousMedicationsView from './previous/PreviousMedicationsView';
import PatientInfoView from '../patient-info/PatientInfoView';
import { Resizable } from '@/components/ui/Resizable';
import { useForm, FormProvider } from "react-hook-form";

interface MedicationsViewProps {
    patientId: string;
}

export default function MedicationsView({ patientId }: MedicationsViewProps) {
    const {
        rxForms,
        medicalOrders,
        loadingMedications,
        templateType,
        setTemplateType,
        rxForm,
        medicalOrder,
        setMedicationField,
        createMedication,
        isLoading,
    } = useMedicationsViewModel(patientId);

    const [isExpanded, setIsExpanded] = useState(false);
    const [previousMedicationsWidth, setPreviousMedicationsWidth] = useState(400);

    const handleResize = (width: number) => {
        setPreviousMedicationsWidth(width);
    };

    const handleCreateMedication = async () => {
        console.log('Create Medication button clicked');
        try {
            await createMedication();
            console.log('Medication created successfully');
        } catch (error) {
            console.error('Error creating medication:', error);
        }
    };

    const methods = useForm({
        defaultValues: {
            rxForm: rxForm,
            medicalOrder: medicalOrder,
        },
    });

    return (
        <FormProvider {...methods}>
            <div className="flex flex-col md:flex-row h-[100vh] bg-darkBlue overflow-hidden">
                {/* Previous Medications Section */}
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
                                    rxForms={rxForms}
                                    medicalOrders={medicalOrders}
                                    loadingMedications={loadingMedications}
                                />
                            </CardContent>
                        </ScrollArea>
                    </Card>
                </Resizable>

                {/* Mobile Previous Medications Section */}
                <Card className="md:hidden w-full">
                    <CardHeader
                        className="px-4 py-2 flex justify-between items-center cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <h3 className="text-lg font-semibold">Previous Medications</h3>
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </CardHeader>
                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[50vh]' : 'max-h-0'}`}>
                        <ScrollArea className="h-[50vh] w-full">
                            <PreviousMedicationsView
                                rxForms={rxForms}
                                medicalOrders={medicalOrders}
                                loadingMedications={loadingMedications}
                            />
                        </ScrollArea>
                    </div>
                </Card>

                {/* Medications Form Section */}
                <Card className="flex-grow h-full md:h-auto overflow-hidden">
                    <CardHeader className="px-4 py-2">
                        <RadioCard.Root
                            defaultValue="rxform"
                            onValueChange={(value) => setTemplateType(value as "rxform" | "medicalrequest")}
                            className="flex w-full"
                        >
                            <RadioCard.Item
                                value="rxform"
                                className={`flex-1 ${templateType === 'rxform' ? 'border-2 border-orange-500' : 'border border-gray-200'}`}
                            >
                                RX Form
                            </RadioCard.Item>
                            <RadioCard.Item
                                value="medicalrequest"
                                className={`flex-1 ${templateType === 'medicalrequest' ? 'border-2 border-orange-500' : 'border border-gray-200'}`}
                            >
                                Medical Request
                            </RadioCard.Item>
                        </RadioCard.Root>
                    </CardHeader>
                    <CardContent className="h-full md:h-[calc(100vh-120px)] p-0">
                        <ScrollArea className="h-full w-full pb-16">
                            <div className="mt-4 p-4">
                                {templateType === 'rxform' ? (
                                    <RXFormView
                                        rxForm={rxForm}
                                        onChange={(name, value) => {
                                            methods.setValue(`rxForm.${name}`, value);
                                            setMedicationField('rxform', name, value);
                                        }}
                                    />
                                ) : (
                                    <MedicalOrderRequestView
                                        medicalOrder={medicalOrder}
                                        onChange={(name, value) => {
                                            methods.setValue(`medicalOrder.${name}`, value);
                                            setMedicationField('medicalrequest', name, value);
                                        }}
                                    />
                                )}
                                <Button
                                    onClick={handleCreateMedication}
                                    variant="submit"
                                    className="mt-4"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Create Medication'}
                                </Button>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </FormProvider>
    );
}