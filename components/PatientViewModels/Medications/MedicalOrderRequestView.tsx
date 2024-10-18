// components/form/Medications/MedicalOrderRequestView.tsx
import React from 'react';
import { useMedicalOrderRequestViewModel } from './MedicalOrderRequestViewModel';
import { TextFormField } from '@/components/ui/TextFormField';
import ReadOnlyField from '@/components/form/ReadOnlyField';
import { Button } from '@/components/ui/button';
import { SendHorizonal } from "lucide-react";

export default function MedicalOrderRequestView() {
    const { medicalOrderRequest, handleInputChange, publishMedicalOrderRequest } = useMedicalOrderRequestViewModel();

    return (
        <form>
            <ReadOnlyField
                fieldName="date"
                fieldLabel="Date"
                value={medicalOrderRequest.date}
            />
            <ReadOnlyField
                fieldName="drInCharge"
                fieldLabel="Dr In Charge"
                value={medicalOrderRequest.drInCharge}
            />
            <TextFormField
                fieldName="specialty"
                fieldLabel="Specialty"
                value={medicalOrderRequest.specialty}
                onChange={handleInputChange}
            />
            <TextFormField
                fieldName="patientName"
                fieldLabel="Patient's Full Name"
                value={medicalOrderRequest.patientName}
                onChange={handleInputChange}
            />
            <TextFormField
                fieldName="patientPhoneNumber"
                fieldLabel="Patient's Phone Number"
                value={medicalOrderRequest.patientPhoneNumber}
                onChange={handleInputChange}
            />
            <TextFormField
                fieldName="patientAddress"
                fieldLabel="Patient's Address"
                value={medicalOrderRequest.patientAddress}
                onChange={handleInputChange}
            />
            <TextFormField
                fieldName="diagnosis"
                fieldLabel="Diagnosis"
                value={medicalOrderRequest.diagnosis}
                onChange={handleInputChange}
                multiline={true}
                rows={2}
            />
            <TextFormField
                fieldName="medications"
                fieldLabel="Medications"
                value={medicalOrderRequest.medications}
                onChange={handleInputChange}
                multiline={true}
                rows={2}
            />
            <TextFormField
                fieldName="dosage"
                fieldLabel="Dosage"
                value={medicalOrderRequest.dosage}
                onChange={handleInputChange}
                multiline={true}
                rows={2}
            />
            <TextFormField
                fieldName="frequency"
                fieldLabel="Frequency/Duration"
                value={medicalOrderRequest.frequency}
                onChange={handleInputChange}
                multiline={true}
                rows={2}
            />
            <Button
                variant="submit"
                size="default"
                onClick={publishMedicalOrderRequest}
            >
                <SendHorizonal className="mr-2" /> Publish Medical Order Request
            </Button>
        </form>
    );
}