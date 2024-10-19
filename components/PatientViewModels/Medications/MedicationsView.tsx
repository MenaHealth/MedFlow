// components/PatientViewModels/Medications/MedicationsView.tsx
import React, { useState } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioCard } from "@/components/ui/radio-card";
import { ScrollArea } from '@/components/form/ScrollArea';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMedicationsViewModel } from './MedicationsViewModel';
import RXOrderView from './rx/RXOrderView';
import MedOrderView from './medX/MedOrderView';
import PreviousMedicationsView from './previous/PreviousMedicationsView';
import { Resizable } from '@/components/ui/Resizable';
import {useRXFormViewModel} from "@/components/PatientViewModels/Medications/rx/RXOrderViewModel";

interface MedicationsViewProps {
    patientId: string;
}

export default function MedicationsView({ patientId }: MedicationsViewProps) {
    const {
        rxForm,
        publishRXForm,
        previousRXForms,
        isLoading,
    } = useRXFormViewModel(patientId);

    const [isExpanded, setIsExpanded] = useState(false);
    const [previousMedicationsWidth, setPreviousMedicationsWidth] = useState(400);
    const [templateType, setTemplateType] = useState<'rxform' | 'medicalrequest'>('rxform');

    const methods = useForm({
        defaultValues: rxForm,
    });

    const handleResize = (width: number) => {
        setPreviousMedicationsWidth(width);
    };

    const handleCreateMedication = async (data: any) => {
        if (templateType === 'rxform') {
            await publishRXForm(data);
        } else {
            // Handle medical request submission
            console.log('Medical request submission not implemented yet');
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleCreateMedication)}>
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
                                        rxForms={previousRXForms}
                                        medicalOrders={[]} // Add medical orders here when implemented
                                        loadingMedications={false}
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
                                    rxForms={previousRXForms}
                                    medicalOrders={[]} // Add medical orders here when implemented
                                    loadingMedications={false}
                                />
                            </ScrollArea>
                        </div>
                    </Card>

                    {/* Medications Form Section */}
                    <Card className="flex-grow h-full md:h-auto overflow-hidden">
                        <CardHeader className="px-4 py-2">
                            <RadioCard.Root
                                defaultValue={templateType}
                                onValueChange={(value) => {
                                    setTemplateType(value as "rxform" | "medicalrequest");
                                    methods.reset(value === 'rxform' ? rxForm : {});
                                }}
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
                                        <RXOrderView />
                                    ) : (
                                        <MedOrderView />
                                    )}
                                    <Button
                                        type="submit"
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
            </form>
        </FormProvider>
    );
}