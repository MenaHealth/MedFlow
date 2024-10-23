import React, { useState } from 'react';
import { TextFormField } from './../../../../components/ui/TextFormField';
import { Button } from './../../../../components/ui/button';
import { SingleChoiceFormField } from './../../../../components/form/SingleChoiceFormField';
import { Pharmacies } from './../../../../data/pharmacies.enum';
import { useRXOrderViewModel } from './../../../../components/PatientViewModels/Medications/rx/RXOrderViewModel';
import { DoctorSpecialtyList } from './../../../../data/doctorSpecialty.enum';
import { Plus, Minus } from 'lucide-react';

interface User {
    firstName: string;
    lastName: string;
    doctorSpecialty: keyof typeof DoctorSpecialtyList;
}

interface PatientDetails {
    patientName: string;
}

interface ExpandedDetails {
    phone: string;
    age: string;
}

interface RXOrderViewProps {
    user: User;
    patientId: string;
    patientDetails: PatientDetails;
    expandedDetails: ExpandedDetails;
}

export default function RXOrderView({ patientId, user, patientDetails, expandedDetails }: RXOrderViewProps) {
    const { rxOrder, isLoading, handleInputChange, submitRxOrder } = useRXOrderViewModel(
        patientId,
        patientDetails.patientName,
        expandedDetails.phone,
        expandedDetails.age,
        expandedDetails.city
    );

    const [prescriptions, setPrescriptions] = useState(rxOrder.prescriptions || [{ medication: '', dosage: '', frequency: '' }]);

    const addPrescription = () => {
        setPrescriptions([...prescriptions, { medication: '', dosage: '', frequency: '' }]);
    };

    const removePrescription = (index: number) => {
        setPrescriptions(prescriptions.filter((_, idx) => idx !== index));
    };

    const handlePrescriptionChange = (index: number, field: keyof typeof prescriptions[0], value: string) => {
        const updatedPrescriptions = [...prescriptions];
        updatedPrescriptions[index] = { ...updatedPrescriptions[index], [field]: value };
        setPrescriptions(updatedPrescriptions);
        handleInputChange('prescriptions', updatedPrescriptions);
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <fieldset className="border rounded-lg p-6 bg-white shadow-sm">
                <legend className="text-lg font-semibold px-2">Prescriber and Patient Details</legend>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <TextFormField
                            fieldName="prescribingDoctor"
                            fieldLabel="Dr."
                            value={`${user?.firstName || ''} ${user?.lastName || ''}`}
                            readOnly={true}
                        />
                        <TextFormField
                            fieldName="doctorSpecialization"
                            fieldLabel="Specialization"
                            value={user.doctorSpecialty}
                            readOnly={true}
                        />
                    </div>
                    <TextFormField
                        fieldName="patientName"
                        fieldLabel="Patient's Full Name"
                        value={rxOrder.patientName}
                        readOnly={true}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <TextFormField
                            fieldName="phoneNumber"
                            fieldLabel="Patient Phone Number"
                            value={rxOrder.phoneNumber}
                            readOnly={true}
                        />
                        <TextFormField
                            fieldName="age"
                            fieldLabel="Age"
                            value={rxOrder.age}
                            readOnly={true}
                        />
                        <TextFormField
                            fieldName="city"
                            fieldLabel="Patient City"
                            value={rxOrder.city}
                            readOnly={true}
                        />
                    </div>
                </div>
                <hr className="my-6 border-gray-200" />
                <div className="space-y-4">
                    <TextFormField
                        fieldName="diagnosis"
                        fieldLabel="Diagnosis"
                        value={rxOrder.diagnosis}
                        onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                        multiline={true}
                        rows={3}
                    />
                </div>
            </fieldset>

            {/* Prescription Fields */}
            {prescriptions.map((prescription, index) => (
                <fieldset key={index} className="border rounded-lg p-6 bg-white shadow-sm relative overflow-hidden">
                    <legend className="text-lg font-semibold px-2 flex items-center w-full">
                        <span>Prescription {index + 1}</span>
                        <div className="ml-auto flex space-x-2">
                            {index === prescriptions.length - 1 && (
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
                            {prescriptions.length > 1 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removePrescription(index)}
                                    className="h-7 w-7 rounded-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                    aria-label="Remove prescription"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </legend>
                    <div className="space-y-4 mt-4">
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
                variant={"submit"}
            >
                {isLoading ? 'Submitting...' : 'Submit Rx'}
            </Button>
        </div>
    );
}