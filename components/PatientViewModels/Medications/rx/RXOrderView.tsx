import React from 'react';
import { useFormContext } from 'react-hook-form';
import { TextFormField } from '@/components/ui/TextFormField';
import { SingleChoiceFormField } from '@/components/form/SingleChoiceFormField';
import { Pharmacies } from '@/data/pharmacies.enum';
import { IRXForm } from '@/models/rxOrders';

export default function RXOrderView() {
        const { register } = useFormContext<IRXForm['content']>();

        return (
            <div className="space-y-4">
                    <TextFormField
                        fieldName="patientName"
                        fieldLabel="Patient's Full Name"
                        register={register}
                    />
                    <TextFormField
                        fieldName="phoneNumber"
                        fieldLabel="Phone Number"
                        register={register}
                    />
                    <TextFormField
                        fieldName="age"
                        fieldLabel="Age"
                        register={register}
                    />
                    <TextFormField
                        fieldName="address"
                        fieldLabel="Address"
                        register={register}
                    />
                    <TextFormField
                        fieldName="referringDr"
                        fieldLabel="Referring Doctor"
                        register={register}
                    />
                    <TextFormField
                        fieldName="prescribingDr"
                        fieldLabel="Prescribing Doctor"
                        register={register}
                    />
                    <TextFormField
                        fieldName="diagnosis"
                        fieldLabel="Diagnosis"
                        register={register}
                    />
                    <TextFormField
                        fieldName="medicationsNeeded"
                        fieldLabel="Medications Needed"
                        register={register}
                        multiline
                        rows={2}
                    />
                    <TextFormField
                        fieldName="dosage"
                        fieldLabel="Dosage"
                        register={register}
                    />
                    <TextFormField
                        fieldName="frequency"
                        fieldLabel="Frequency"
                        register={register}
                    />
                    <SingleChoiceFormField
                        fieldName="pharmacyOrClinic"
                        fieldLabel="Pharmacy or Clinic"
                        choices={Pharmacies}
                        register={register}
                    />
                    <TextFormField
                        fieldName="medication"
                        fieldLabel="Medication"
                        register={register}
                    />
            </div>
        );
}