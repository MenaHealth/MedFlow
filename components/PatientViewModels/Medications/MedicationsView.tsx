// components/PatientViewModels/Medications/MedicationsView.tsx
import React, { useState } from 'react';
import { Button } from './../../../components/ui/button';
import RXFormView from './RXFormView';
import MedicalOrderRequestView from './MedicalOrderRequestView';
import PreviousMedicationsView from './PreviousMedicationsView';
import PatientInfoView from '../patient-info/PatientInfoView';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMedicationsViewModel } from './MedicationsViewModel';

export default function MedicationsView() {
    const { rxForms, medicalOrders, loadingMedications, refreshMedications } = useMedicationsViewModel();
    const [templateType, setTemplateType] = useState<'rxform' | 'medicalrequest'>('rxform');
    const [isPreviousMedicationsExpanded, setIsPreviousMedicationsExpanded] = useState(false);

    return (
        <div className="container mx-auto p-4 flex flex-col space-y-6" style={{ paddingBottom: '80px', minHeight: '100vh' }}>
            <div className="flex flex-col md:flex-row md:space-x-4">
                {/* Previous Medications - Desktop on the left, Mobile as expandable */}
                <div className="w-full md:w-1/2">
                    {/* Mobile collapsible section for Previous Medications */}
                    <div className="md:hidden">
                        <Button
                            variant="outline"
                            onClick={() => setIsPreviousMedicationsExpanded(!isPreviousMedicationsExpanded)}
                            className="flex items-center justify-between w-full"
                        >
                            <span>Previous Medications</span>
                            {isPreviousMedicationsExpanded ? <ChevronUp /> : <ChevronDown />}
                        </Button>
                        {isPreviousMedicationsExpanded && (
                            <div className="mt-2">
                                <PreviousMedicationsView
                                    rxForms={rxForms}
                                    medicalOrders={medicalOrders}
                                    loadingMedications={loadingMedications}
                                />
                            </div>
                        )}
                    </div>

                    {/* Desktop-only Previous Medications View */}
                    <div className="hidden md:block">
                        <PreviousMedicationsView
                            rxForms={rxForms}
                            medicalOrders={medicalOrders}
                            loadingMedications={loadingMedications}
                        />
                    </div>
                </div>

                {/* Patient Information Section */}
                <div className="w-full md:w-1/2">
                    <PatientInfoView
                        patientName={rxForms[0]?.content.patientName || ''}
                        phoneNumber={rxForms[0]?.content.phoneNumber || ''}
                        age={rxForms[0]?.content.age || ''}
                        patientID={rxForms[0]?._id || ''}
                        date={new Date().toISOString().split('T')[0]}
                    />
                </div>
            </div>

            {/* Radio Card for Switching Forms */}
            <div className="flex justify-center space-x-4 mb-4">
                <Button variant="outline" onClick={() => setTemplateType('rxform')}>
                    RX Form
                </Button>
                <Button variant="outline" onClick={() => setTemplateType('medicalrequest')}>
                    Medical Request
                </Button>
            </div>

            {/* Render the Selected Form - Full Width */}
            <div className="w-full bg-white p-4">
                {templateType === 'rxform' ? (
                    <RXFormView refreshMedications={refreshMedications} />
                ) : (
                    <MedicalOrderRequestView refreshMedications={refreshMedications} />
                )}
            </div>
        </div>
    );
}