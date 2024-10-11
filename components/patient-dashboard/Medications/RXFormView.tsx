// components/form/Medications/RXFormView.tsx
import React from 'react';
import { useRXFormViewModel } from './RXFormViewModel';
import TextFormField from '@/components/ui/TextFormField';
import { Button } from '@/components/ui/button';
import { SendHorizonal } from "lucide-react";

export default function RXFormView({ user, patientId }) {
    const { rxForm, handleInputChange, publishRXForm } = useRXFormViewModel(user, patientId);

    return (
        <form>
            <TextFormField
                fieldName="diagnosis"
                fieldLabel="Diagnosis"
                value={rxForm.diagnosis}
                onChange={handleInputChange}
            />
            <TextFormField
                fieldName="medicationsNeeded"
                fieldLabel="Medications Needed"
                value={rxForm.medicationsNeeded}
                onChange={handleInputChange}
                multiline
                rows={2}
            />
            <TextFormField
                fieldName="dosage"
                fieldLabel="Dosage"
                value={rxForm.dosage}
                onChange={handleInputChange}
            />
            <TextFormField
                fieldName="frequency"
                fieldLabel="Frequency"
                value={rxForm.frequency}
                onChange={handleInputChange}
            />
            <Button
                variant="submit"
                size="default"
                onClick={publishRXForm}
            >
                <SendHorizonal className="mr-2" /> Publish RX Form
            </Button>
        </form>
    );
}