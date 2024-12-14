'use client'

import React, { useState } from 'react';
import { TextFormField } from '@/components/ui/TextFormField';
import { Button } from '@/components/ui/button';
import { ClipLoader } from 'react-spinners'
import { useRXOrderViewModel } from './RXOrderViewModel';
import { DoctorSpecialtyList } from '@/data/doctorSpecialty.enum';
import { Plus, Minus } from 'lucide-react';
import { DatePickerFormField } from "@/components/form/DatePickerFormField";
import { IRxOrder } from "@/models/patient";
import { ToastComponent } from '@/components/hooks/useToast';
import { ToastProvider } from '@/components/ui/toast';
import {Types} from "mongoose";


interface User {
    firstName: string;
    lastName: string;
    doctorSpecialty: keyof typeof DoctorSpecialtyList;
}

interface RXOrderViewProps {
    user: User;
    patientId: Types.ObjectId | undefined | string;
    patientInfo: {
        patientName: string;
        phoneNumber: string;
        dob: Date;
        city: string;
    };
    onNewRxOrderSaved: (rxOrder: IRxOrder) => void;
}


export default function RXOrderView({ patientId, patientInfo, onNewRxOrderSaved }: RXOrderViewProps) {
    const {
        rxOrder,
        submitRxOrder,
        isLoading,
        isFormComplete,
        handleInputChange,
        handlePrescriptionChange,
        addPrescription,
        removePrescription,
    } = useRXOrderViewModel(patientId, patientInfo.city, patientInfo.patientName);


    const orange300 = "#ffa270";

    return (
        <ToastProvider>
            <div className="space-y-6 max-w-2xl mx-auto bg-orange-950 p-4">
                <fieldset className="border rounded-lg bg-white shadow-sm">
                    <legend className="text-lg font-semibold px-2 bg-orange-950 text-white rounded-lg">Prescriber and
                        Patient Details
                    </legend>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <TextFormField
                                fieldName="prescribingDoctor"
                                fieldLabel="Dr."
                                value={rxOrder.prescribingDr}
                                readOnly={true}
                            />
                            <TextFormField
                                fieldName="doctorSpecialty"
                                fieldLabel="Specialization"
                                value={rxOrder.doctorSpecialty}
                                readOnly={true}
                            />
                        </div>
                        <TextFormField
                            fieldName="patientName"
                            fieldLabel="Patient's Full Name"
                            value={patientInfo.patientName}
                            readOnly={true}
                        />
                        <TextFormField
                            fieldName="city"
                            fieldLabel="Patient City"
                            value={patientInfo.city}
                            readOnly={true}
                        />
                    </div>
                    <hr className="my-6 border-gray-200"/>
                    <div
                        className="space-y-4 flex flex-col items-center justify-center text-center border-4 bg-orange-950 border-white rounded-lg p-4">
                        <div className="text-white -mb-4">
                            Valid Till
                        </div>
                        <DatePickerFormField
                            name="validTill"
                            type="future"
                            value={rxOrder.validTill}
                            onChange={(date) => handleInputChange('validTill', date)}
                        />
                    </div>
                </fieldset>

                {rxOrder.prescriptions.map((prescription, index) => (
                    <fieldset key={index} className="border rounded-lg p-6 bg-white shadow-sm relative overflow-hidden">
                        <legend
                            className="text-lg font-semibold px-2 flex items-center w-full bg-orange-950 text-white rounded-lg">
                            <span>Prescription {index + 1}</span>
                            <div className="ml-auto flex space-x-2">
                                {index === rxOrder.prescriptions.length - 1 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={addPrescription}
                                        className="h-7 w-7 rounded-full"
                                        aria-label="Add prescription"
                                    >
                                        <Plus className="h-4 w-4"/>
                                    </Button>
                                )}
                                {rxOrder.prescriptions.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removePrescription(index)}
                                        className="h-7 w-7 rounded-full text-white hover:bg-accent hover:text-accent-foreground"
                                        aria-label="Remove prescription"
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
                                value={prescription.diagnosis}
                                onChange={(e) => handlePrescriptionChange(index, 'diagnosis', e.target.value)}
                                multiline={true}
                                rows={3}
                            />
                            <TextFormField
                                fieldName={`medication-${index}`}
                                fieldLabel="Medication"
                                value={prescription.medication}
                                onChange={(e) => handlePrescriptionChange(index, 'medication', e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <TextFormField
                                    fieldName={`dosage-${index}`}
                                    fieldLabel="Dosage"
                                    value={prescription.dosage}
                                    onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                                />
                                <TextFormField
                                    fieldName={`frequency-${index}`}
                                    fieldLabel="Frequency"
                                    value={prescription.frequency}
                                    onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)}
                                />
                            </div>
                        </div>
                    </fieldset>
                ))}

                <div className="space-y-6 max-w-2xl mx-auto bg-orange-950">
                    <Button
                        onClick={submitRxOrder}
                        disabled={isLoading || !isFormComplete}
                        className="w-full flex justify-center items-center"
                        variant="submit"
                    >
                        {isLoading ? (
                            <ClipLoader size={24} color={orange300} loading={isLoading}/>
                        ) : (
                            'Submit Rx Order'
                        )}
                    </Button>
                </div>
            </div>
            <ToastComponent />
        </ToastProvider>
    );
}