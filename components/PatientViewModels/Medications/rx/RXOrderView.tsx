import React from 'react';
import { useFormContext } from 'react-hook-form';
import { TextFormField } from './../../../../components/ui/TextFormField';
import { SingleChoiceFormField } from '../../../../components/form/SingleChoiceFormField';
import { Pharmacies } from './../../../../data/pharmacies.enum';
import { IRxOrder } from './../../../../models/rxOrders';

export default function RXOrderView() {

        return (
            <div className="space-y-4">
                    <TextFormField
                        fieldName="patientName"
                        fieldLabel="Patient's Full Name"
                    />
                    <TextFormField
                        fieldName="phoneNumber"
                        fieldLabel="Phone Number"
                    />
                    <TextFormField
                        fieldName="age"
                        fieldLabel="Age"
                    />
                    <TextFormField
                        fieldName="address"
                        fieldLabel="Address"
                    />
                    <TextFormField
                        fieldName="referringDr"
                        fieldLabel="Referring Doctor"
                    />
                    <TextFormField
                        fieldName="prescribingDr"
                        fieldLabel="Prescribing Doctor"
                    />
                    <TextFormField
                        fieldName="diagnosis"
                        fieldLabel="Diagnosis"
                    />
                    <TextFormField
                        fieldName="medicationsNeeded"
                        fieldLabel="Medications Needed"
                        multiline
                        rows={2}
                    />
                    <TextFormField
                        fieldName="dosage"
                        fieldLabel="Dosage"
                    />
                    <TextFormField
                        fieldName="frequency"
                        fieldLabel="Frequency"
                    />
                    <SingleChoiceFormField
                        fieldName="pharmacyOrClinic"
                        fieldLabel="Pharmacy or Clinic"
                        choices={Pharmacies}
                    />
                    <TextFormField
                        fieldName="medication"
                        fieldLabel="Medication"
                    />
            </div>
        );
}