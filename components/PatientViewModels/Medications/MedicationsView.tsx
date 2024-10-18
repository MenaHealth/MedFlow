// components/form/Medications/MedicationsView.tsx
import React, { useState } from 'react';
import { Button } from './../../../components/ui/button';
import RXFormView from './RXFormView';
import MedicalOrderRequestView from './MedicalOrderRequestView';
import PatientInfoView from '../patient-info/PatientInfoView';
import PreviousMedications from './PreviousMedications';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Session } from 'next-auth';
import { RXForm } from './../../../models/RXForm';
import { MedX } from './../../../models/MedX';

interface MedicationsViewProps {
    user: Session['user'];
    patientId: string;
    rxForms: RXForm[];
    medicalOrders: MedX[];
    loadingMedications: boolean;
    refreshMedications: () => Promise<void>;
}

export default function MedicationsView({
                                            user,
                                            patientId,
                                            rxForms,
                                            medicalOrders,
                                            loadingMedications,
                                            refreshMedications
                                        }: MedicationsViewProps) {
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
                                <PreviousMedications
                                    rxForms={rxForms}
                                    medicalOrders={medicalOrders}
                                    loadingMedications={loadingMedications}
                                />
                            </div>
                        )}
                    </div>

                    {/* Desktop-only Previous Medications View */}
                    <div className="hidden md:block">
                        <PreviousMedications
                            rxForms={rxForms}
                            medicalOrders={medicalOrders}
                            loadingMedications={loadingMedications}
                        />
                    </div>
                </div>

                {/* Patient Information Section */}
                <div className="w-full md:w-1/2">
                    <PatientInfoView
                        patientName={rxForms[0]?.patientName || ''}
                        phoneNumber={rxForms[0]?.phoneNumber || ''}
                        age={rxForms[0]?.age || ''}
                        patientID={patientId}
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
                    <RXFormView user={user} patientId={patientId} refreshMedications={refreshMedications} />
                ) : (
                    <MedicalOrderRequestView user={user} patientId={patientId} refreshMedications={refreshMedications} />
                )}
            </div>
        </div>
    );
}