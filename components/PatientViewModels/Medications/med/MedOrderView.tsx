// components/PatientViewModels/Medications/med/MedOrderView.tsx

'use client'

import React, { useMemo } from 'react';
import { TextFormField } from '@/components/ui/TextFormField';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { useMedOrderViewModel } from './MedOrderViewModel';
import { DoctorSpecialtyList } from "@/data/doctorSpecialty.enum";
import { ToastProvider } from '@/components/ui/toast';
import { ToastComponent } from '@/components/hooks/useToast';
import { Types } from "mongoose";
import {ClipLoader} from "react-spinners";
import RxOrderDrawerView from "@/components/PatientViewModels/Medications/rx/RxOrderDrawerView";

interface User {
    firstName: string;
    lastName: string;
    doctorSpecialty: keyof typeof DoctorSpecialtyList;
}

interface MedOrderViewProps {
    user: User;
    patientId: string | Types.ObjectId;
}

export default function MedOrderView({ patientId, user }: MedOrderViewProps) {
    const {
        medOrder,
        isLoading,
        handleMedicationChange,
        addMedication,
        removeMedication,
        submitMedOrder,
    } = useMedOrderViewModel(patientId, user.firstName, user.doctorSpecialty);

    // Optimized isFormComplete logic
    const isFormComplete = useMemo(() =>
            medOrder.medications.every(medication =>
                medication.diagnosis?.trim() &&
                medication.medication?.trim() &&
                medication.dosage?.trim() &&
                medication.frequency?.trim() &&
                medication.quantity?.trim()
            ),
        [medOrder.medications]);

    return (
        <ToastProvider>
            <div className="space-y-6 max-w-2xl mx-auto bg-orange-950 p-4">
                <fieldset className="border rounded-lg bg-white shadow-sm">
                    <legend className="text-lg font-semibold px-2 bg-orange-950 text-white rounded-lg">Doctor and
                        Patient Details
                    </legend>
                    <div className="space-y-4 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextFormField
                                fieldName="doctorName"
                                fieldLabel="Dr."
                                value={`${user.firstName} ${user.lastName}`}
                                readOnly={true}
                            />
                            <TextFormField
                                fieldName="doctorSpecialty"
                                fieldLabel="Specialization"
                                value={medOrder.doctorSpecialty}
                                readOnly={true}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextFormField
                                fieldName="patientName"
                                fieldLabel="Patient's Full Name"
                                value={medOrder.patientName}
                                readOnly={true}
                            />
                            <TextFormField
                                fieldName="patientCountry"
                                fieldLabel="Country"
                                value={medOrder.patientCountry}
                                readOnly={true}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextFormField
                                fieldName="patientCity"
                                fieldLabel="City"
                                value={medOrder.patientCity}
                                readOnly={true}
                            />
                            <TextFormField
                                fieldName="patientPhone"
                                fieldLabel="Phone"
                                value={medOrder.patientPhone}
                                readOnly={true}
                            />
                        </div>
                    </div>
                </fieldset>

                {medOrder.medications.map((medication, index) => (
                    <fieldset key={index}
                              className="border rounded-lg p-4 md:p-6 bg-white shadow-sm relative overflow-hidden">
                        <legend
                            className="text-lg font-semibold px-2 flex items-center w-full bg-orange-950 text-white rounded-lg">
                            <span>Medication {index + 1}</span>
                            <div className="ml-auto flex space-x-2">
                                {index === medOrder.medications.length - 1 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={addMedication}
                                        className="h-7 w-7 rounded-full"
                                        aria-label="Add medication"
                                    >
                                        <Plus className="h-4 w-4"/>
                                    </Button>
                                )}
                                {medOrder.medications.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeMedication(index)}
                                        className="h-7 w-7 rounded-full text-white hover:bg-accent hover:text-accent-foreground"
                                        aria-label="Remove medication"
                                    >
                                        <Minus className="h-4 w-4"/>
                                    </Button>
                                )}
                            </div>
                        </legend>
                        <div className="space-y-4 mt-4">
                            <TextFormField
                                fieldName={`diagnosis-${index}`}
                                fieldLabel="Diagnosis"
                                value={medication.diagnosis}
                                onChange={(e) => handleMedicationChange(index, 'diagnosis', e.target.value)}
                                multiline={true}
                                rows={3}
                            />
                            <TextFormField
                                fieldName={`medication-${index}`}
                                fieldLabel="Medication"
                                value={medication.medication}
                                onChange={(e) => handleMedicationChange(index, 'medication', e.target.value)}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <TextFormField
                                    fieldName={`dosage-${index}`}
                                    fieldLabel="Dosage"
                                    value={medication.dosage}
                                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                />
                                <TextFormField
                                    fieldName={`frequency-${index}`}
                                    fieldLabel="Frequency"
                                    value={medication.frequency}
                                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                />
                                <TextFormField
                                    fieldName={`quantity-${index}`}
                                    fieldLabel="Quantity"
                                    value={medication.quantity}
                                    onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value)}
                                />
                            </div>
                        </div>
                    </fieldset>
                ))}

                <div className="space-y-6 max-w-2xl mx-auto bg-orange-950">
                    <Button
                        onClick={submitMedOrder}
                        disabled={isLoading || !isFormComplete}
                        variant="submit"
                        className="w-full flex justify-center items-center"
                    >
                        {isLoading ? 'Submitting...' : 'Submit Medical Order'}
                    </Button>
                </div>

                    {/*<div className="space-y-6 max-w-2xl mx-auto bg-orange-950">*/}
                    {/*    <Button*/}
                    {/*        onClick={submitRxOrder}*/}
                    {/*        disabled={isLoading || !isFormComplete}*/}
                    {/*        className="w-full flex justify-center items-center"*/}
                    {/*        variant="submit"*/}
                    {/*    >*/}
                    {/*        {isLoading ? (*/}
                    {/*            <ClipLoader size={24} color={orange300} loading={isLoading}/>*/}
                    {/*        ) : (*/}
                    {/*            'Submit Rx Order'*/}
                    {/*        )}*/}
                    {/*    </Button>*/}

                    {/*    <RxOrderDrawerView*/}
                    {/*        isOpen={isDrawerOpen}*/}
                    {/*        onClose={() => setIsDrawerOpen(false)}*/}
                    {/*        rxOrder={selectedRxOrder}*/}
                    {/*        patientId={patientId}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>
                <ToastComponent/>
        </ToastProvider>
);
}