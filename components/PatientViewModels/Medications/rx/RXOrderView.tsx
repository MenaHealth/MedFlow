import React, { useState } from 'react';
import { TextFormField } from '@/components/ui/TextFormField';
import { Button } from '@/components/ui/button';
import { ClipLoader } from 'react-spinners'
import { useRXOrderViewModel } from '@/components/PatientViewModels/Medications/rx/RXOrderViewModel';
import { DoctorSpecialtyList } from '@/data/doctorSpecialty.enum';
import { Plus, Minus } from 'lucide-react';
import { DatePickerFormField } from "@/components/form/DatePickerFormField";
import RxOrderDrawerView from './RxOrderDrawerView';
import { IRxOrder } from "@/models/patient";

interface User {
    firstName: string;
    lastName: string;
    doctorSpecialty: keyof typeof DoctorSpecialtyList;
}

interface RXOrderViewProps {
    user: User;
    patientId: string;
    patientInfo: {
        patientName: string;
        phoneNumber: string;
        age: string;
        city: string;
    };
}

export default function RXOrderView({ patientId, user, patientInfo }: RXOrderViewProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedRxOrder, setSelectedRxOrder] = useState<IRxOrder | null>(null);

    const onNewRxOrderSaved = (rxOrder: IRxOrder) => {
        setSelectedRxOrder(rxOrder);
        setIsDrawerOpen(true);  // Open drawer only after saving
    };

    const {
        rxOrder,
        setRxOrder,
        submitRxOrder,
        isLoading,
        handleInputChange,
        handlePrescriptionChange,
        addPrescription,
        removePrescription,
    } = useRXOrderViewModel(patientId, onNewRxOrderSaved, patientInfo.city);

    const orange300 = "#ffa270";

    return (
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
                    className="space-y-4 flex flex-col items-center justify-center text-center border-t-4 border-t-orange-950 rounded-lg p-4">
                    <DatePickerFormField
                        name="validTill"
                        label="Valid Till"
                        type="future"
                        value={rxOrder.validTill}
                        onChange={(date) => setRxOrder(prev => ({
                            ...prev,
                            validTill: date || prev.validTill
                        }))}
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
                    disabled={isLoading}
                    className="w-full flex justify-center items-center"
                    variant="submit"
                >
                    {isLoading ? (
                        <ClipLoader size={24} color={orange300} loading={isLoading} />
                    ) : (
                        'Submit Rx'
                    )}
                </Button>

                <RxOrderDrawerView
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    rxOrder={selectedRxOrder}
                    patientId={patientId}
                />
            </div>
        </div>
    );
}