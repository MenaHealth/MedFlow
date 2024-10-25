    // components/form/Medications/MedOrderView.tsx

    import React, { useState } from 'react';
    import { TextFormField } from '../../../../components/ui/TextFormField';
    import { Button } from '../../../../components/ui/button';
    import { useMedOrderRequestViewModel } from './MedOrderViewModel';
    import { Plus, Minus } from 'lucide-react';

    interface User {
        firstName: string;
        lastName: string;
        doctorSpecialty: string;
    }

    interface PatientDetails {
        patientName: string;
    }

    interface ExpandedDetails {
        city: string;
        phone: string;
    }

    interface MedOrderViewProps {
        user: User;
        patientId: string;
        patientDetails: PatientDetails;
        expandedDetails: ExpandedDetails;
    }

    export default function MedOrderView({ patientId, user, patientDetails, expandedDetails }: MedOrderViewProps) {
        const { medOrder, isLoading, handleInputChange, submitMedOrder } = useMedOrderRequestViewModel(patientId);

        // State to handle dynamic medication fields
        const [medications, setMedications] = useState(medOrder.medications || [{ medication: '', dosage: '', frequency: '' }]);

        const addMedication = () => {
            setMedications([...medications, { medication: '', dosage: '', frequency: '' }]);
        };

        const removeMedication = (index: number) => {
            setMedications(medications.filter((_, idx) => idx !== index));
        };

        const handleMedicationChange = (index: number, field: keyof typeof medications[0], value: string) => {
            const updatedMedications = [...medications];
            updatedMedications[index] = { ...updatedMedications[index], [field]: value };
            setMedications(updatedMedications);
            handleInputChange('medications', updatedMedications);
        };

        return (
            <div className="space-y-6 max-w-2xl mx-auto">
                <fieldset className="border rounded-lg p-6 bg-white shadow-sm">
                    <legend className="text-lg font-semibold px-2"></legend>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Doctor in Charge and Doctor Specialty */}
                            <TextFormField
                                fieldName="doctorInCharge"
                                fieldLabel="Doctor in Charge"
                                value={`${user.firstName} ${user.lastName}`}
                                readOnly={true}
                            />
                            <TextFormField
                                fieldName="doctorSpecialty"
                                fieldLabel="Doctor Specialty"
                                value={user.doctorSpecialty}
                                readOnly={true}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextFormField
                                fieldName="patientName"
                                fieldLabel="Patient's Full Name"
                                value={patientDetails.patientName}
                                readOnly={true}
                            />
                            <TextFormField
                                fieldName="city"
                                fieldLabel="Patient City"
                                value={expandedDetails.city}
                                readOnly={true}
                            />
                            <TextFormField
                                fieldName="phone"
                                fieldLabel="Patient Phobene Number"
                                value={expandedDetails.city}
                                readOnly={true}
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Medication Fields */}
                {medications.map((medication, index) => (
                    <fieldset key={index} className="border rounded-lg p-6 bg-white shadow-sm relative overflow-hidden">
                        <legend className="text-lg font-semibold px-2 flex items-center w-full">
                            <span>Medication {index + 1}</span>
                            <div className="ml-auto flex space-x-2">
                                {index === medications.length - 1 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={addMedication}
                                        className="h-7 w-7 rounded-full"
                                        aria-label="Add Medication"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                )}
                                {medications.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeMedication(index)}
                                        className="h-7 w-7 rounded-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                        aria-label="Remove Medication"
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
                                value={medication.medication}
                                onChange={(e) => handleMedicationChange(index, 'medication', e.target.value)}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            </div>
                        </div>
                    </fieldset>
                ))}

                <Button onClick={submitMedOrder} disabled={isLoading} className="w-full" variant="submit">
                    {isLoading ? 'Submitting...' : 'Submit Medical Order'}
                </Button>
            </div>
        );
    }