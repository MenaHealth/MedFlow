// components/PatientViewModels/Medications/med/MedOrderView.tsx

'use client'

import React from 'react';
import { TextFormField } from './../../../../components/ui/TextFormField';
import { Button } from './../../../ui/button';
import { IMedOrder } from '../../../../models/medOrder';
import { DoctorSpecialtyList } from './../../../../data/doctorSpecialty.enum';
import { Plus, Minus } from 'lucide-react';
import { useMedOrderViewModel } from './MedOrderViewModel';

interface User {
    firstName: string;
    lastName: string;
    doctorSpecialty: keyof typeof DoctorSpecialtyList;
}

interface MedOrderViewProps {
    user: User;
    patientId: string;
}

export default function MedOrderView({ patientId, user }: MedOrderViewProps) {
    const {
        medOrder,
        isLoading,
        handleInputChange,
        handleMedicationChange,
        addMedication,
        removeMedication,
        submitMedOrder,
        patientInfo,
        patientViewModel,
    } = useMedOrderViewModel(patientId, user.firstName, user.doctorSpecialty);

    const expandedDetails = patientViewModel?.getExpandedDetails();

    return (
        <div className="space-y-6 max-w-2xl mx-auto bg-orange-950">
            <fieldset className="border rounded-lg bg-white shadow-sm">
                <legend className="text-lg font-semibold px-2 bg-orange-950 text-white rounded-lg">Doctor and Patient Details</legend>
                <div className="space-y-4 p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <TextFormField
                            fieldName="doctorName"
                            fieldLabel="Dr."
                            value={`${user.firstName} ${user.lastName}`}
                            readOnly={true}
                        />
                        <TextFormField
                            fieldName="doctorSpecialty"
                            fieldLabel="Specialization"
                            value={user.doctorSpecialty}
                            readOnly={true}
                        />
                    </div>
                    <TextFormField
                        fieldName="patientName"
                        fieldLabel="Patient's Full Name"
                        value={medOrder.patientName}
                        readOnly={true}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <TextFormField
                            fieldName="patientPhone"
                            fieldLabel="Phone"
                            value={medOrder.patientPhone}
                            readOnly={true}
                        />
                        <TextFormField
                            fieldName="patientCity"
                            fieldLabel="City"
                            value={medOrder.patientCity}
                            readOnly={true}
                        />
                    </div>
                </div>
            </fieldset>

            {medOrder.medications.map((medication, index) => (
                <fieldset key={index} className="border rounded-lg p-6 bg-white shadow-sm relative overflow-hidden">
                    <legend className="text-lg font-semibold px-2 flex items-center w-full bg-orange-950 text-white rounded-lg">
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
                                    <Plus className="h-4 w-4" />
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
                                    <Minus className="h-4 w-4" />
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
                        <div className="grid grid-cols-3 gap-4">
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

            <Button
                onClick={submitMedOrder}
                disabled={isLoading}
                className="w-full"
                variant="submit"
            >
                {isLoading ? 'Submitting...' : 'Submit Medical Order'}
            </Button>
        </div>
    );
}