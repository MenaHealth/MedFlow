import React from 'react';
import { TextFormField } from './../../../../components/ui/TextFormField';
import { Button } from './../../../../components/ui/button';
import { useRXOrderViewModel } from './../../../../components/PatientViewModels/Medications/rx/RXOrderViewModel';
import { DoctorSpecialties } from './../../../../data/doctorSpecialty.enum';
import { Plus, Minus } from 'lucide-react';
import {DatePickerFormField} from "./../../../../components/form/DatePickerFormField";

interface User {
    firstName: string;
    lastName: string;
    doctorSpecialty: keyof typeof DoctorSpecialties;
}

interface RXOrderViewProps {
    user: User;
    patientId: string;
}

export default function RXOrderView({ patientId, user }: RXOrderViewProps) {
    const {
        rxOrder,
        isLoading,
        handleInputChange,
        handlePrescriptionChange,
        addPrescription,
        removePrescription,
        submitRxOrder,
        patientInfo,
        patientViewModel
    } = useRXOrderViewModel(patientId);

    const expandedDetails = patientViewModel?.getExpandedDetails();

    return (
        <div className="space-y-6 max-w-2xl mx-auto bg-orange-900">
            <fieldset className="border rounded-lg p-6 bg-white shadow-sm">
                <legend className="text-lg font-semibold px-2 bg-orange-900 text-white rounded-lg">Prescriber and Patient Details</legend>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <TextFormField
                            fieldName="prescribingDoctor"
                            fieldLabel="Dr."
                            value={rxOrder.prescribingDr}
                            readOnly={true}
                        />
                        <TextFormField
                            fieldName="doctorSpecialization"
                            fieldLabel="Specialization"
                            value={rxOrder.doctorSpecialization}
                            readOnly={true}
                        />
                    </div>
                    <TextFormField
                        fieldName="patientName"
                        fieldLabel="Patient's Full Name"
                        value={patientInfo?.patientName || ''}
                        readOnly={true}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <TextFormField
                            fieldName="phoneNumber"
                            fieldLabel="Patient Phone Number"
                            value={expandedDetails?.phone || ''}
                            readOnly={true}
                        />
                        <TextFormField
                            fieldName="age"
                            fieldLabel="Age"
                            value={expandedDetails?.age || ''}
                            readOnly={true}
                        />
                    </div>
                    <TextFormField
                        fieldName="city"
                        fieldLabel="City"
                        value={expandedDetails?.city || ''}
                        readOnly={true}
                    />
                </div>
                <hr className="my-6 border-gray-200" />
                <div className="space-y-4">

                    <DatePickerFormField
                        name="validTill"
                        label="Valid Till"
                        value={rxOrder.Rx.validTill.toISOString()}
                        onChange={(e) => handleInputChange('validTill', new Date(e.target.value))}
                    />
                </div>
            </fieldset>

            {rxOrder.Rx.prescriptions.map((prescription, index) => (
                <fieldset key={index} className="border rounded-lg p-6 bg-white shadow-sm relative overflow-hidden">
                    <legend className="text-lg font-semibold px-2 flex items-center w-full bg-orange-900 text-white rounded-lg">
                        <span>Prescription {index + 1}</span>
                        <div className="ml-auto flex space-x-2">
                            {index === rxOrder.Rx.prescriptions.length - 1 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={addPrescription}
                                    className="h-7 w-7 rounded-full"
                                    aria-label="Add prescription"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            )}
                            {rxOrder.Rx.prescriptions.length > 1 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removePrescription(index)}
                                    className="h-7 w-7 rounded-full text-white hover:bg-accent hover:text-accent-foreground"
                                    aria-label="Remove prescription"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </legend>
                    <div className="space-y-4 mt-4">
                        <TextFormField
                            fieldName="diagnosis"
                            fieldLabel="Diagnosis"
                            value={rxOrder.Rx.prescriptions[0].diagnosis}
                            onChange={(e) => handlePrescriptionChange(0, 'diagnosis', e.target.value)}
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

            <Button
                onClick={submitRxOrder}
                disabled={isLoading}
                className="w-full"
                variant="submit"
            >
                {isLoading ? 'Submitting...' : 'Submit Rx'}
            </Button>
        </div>
    );
}