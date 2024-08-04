// components/form/Fajr/PatientForm.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { TextFormField } from "@/components/form/TextFormField"
import { z } from "zod"
import * as React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { Button } from "@/components/ui/button"

import { NumericalFormField } from "../NumericalFormField"
import { TextAreaFormField } from "../TextAreaFormField"
import { MedicationSelection } from "../MedicationSelection"
import { DatePickerFormField } from "../DatePickerFormField"
import { SelectFormField } from "../SelectFormField"
import { PMHxSelect } from "../PMHxSelection"
import { PSHxSelect } from "../PSHxSelection"

const patientFormSchema = z.object({
    patientId: z.string(),
    name: z.string(),
    phone: z.string(),
    location: z.string(),
    language: z.string(),
    complaint: z.string(),
    age: z.number(),
    diagnosis: z.string(),
    icd10: z.string(),
    surgeryDate: z.instanceof(Date),
    occupation: z.string(),
    baselineAmbu: z.enum(['Independent', 'Boot', 'Crutches', 'Walker', 'Non-Ambulatory']),
    laterality: z.enum(['Bilateral', 'Left', 'Right']),
    priority: z.enum(['Routine', 'Moderate', 'Urgent', 'Emergency']),
    hospital: z.enum(['PMC', 'PRCS', 'Hugo Chavez']),
    medx: z.array(z.object({
        medName: z.string(),
        medDosage: z.string(),
        medFrequency: z.string(),
    })),
    pmhx: z.array(z.string()),
    pshx: z.array(z.string()),
    smokeCount: z.string(),
    drinkCount: z.string(),
    otherDrugs: z.string(),
    allergies: z.string(),
    notes: z.string(),
    files: z.any(),
    status: z.string(),
    triagedBy: z.string(),
    doctor: z.string()
});

type PatientFormValues = z.infer<typeof patientFormSchema>
const defaultValues: Partial<PatientFormValues> = {
    patientId: "",
    name: "",
    phone: "",
    location: "",
    language: "",
    complaint: "",
    age: 0,
    diagnosis: "",
    icd10: "",
    surgeryDate: new Date(),
    occupation: "",
    laterality: "Bilateral",
    priority: "Routine",
    hospital: "PMC",
    baselineAmbu: "Independent",
    medx: [],
    pmhx: [],
    pshx: [],
    smokeCount: "",
    drinkCount: "",
    otherDrugs: "",
    allergies: "",
    notes: "",
    status: 'Not started'
}

export function PatientForm({ id }: { id: string } = { id: '' }) {
    const [patientData, setPatientData] = React.useState<Partial<PatientFormValues>>(defaultValues);

    React.useEffect(() => {
        if (id !== '') {
            fetch(`/api/patient/${id}`)
                .then(response => response.json())
                .then(data => {
                    data.surgeryDate = new Date(data.surgeryDate);
                    data.medx = data.medx.map((med: any) => ({
                        medName: med.medName,
                        medDosage: med.medDosage,
                        medFrequency: med.medFrequency,
                    }));
                    data.age = parseInt(data.age);
                    setPatientData(data);
                })
                .catch(error => {
                    alert('Error: ' + error.message);
                });
        }
    }, [id]);

    const formMethods = useForm<PatientFormValues>({
        resolver: zodResolver(patientFormSchema),
        defaultValues,
    });

    React.useEffect(() => {
        formMethods.reset(patientData);
    }, [patientData, formMethods]);

    const onSubmit = async (data: PatientFormValues) => {
        console.log('Form submitted:', data);

        const response = await fetch('/api/patient/new', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('Patient created successfully');
            window.location.href = '/patient-info/dashboard';
        } else {
            console.error('Error creating patient:', response.statusText);
            alert('Error: ' + response.statusText);
        }
    };

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex space-x-4">
                    <div className="w-1/3">
                        <TextFormField form={formMethods} fieldName="patientId" fieldLabel="Patient ID" />
                    </div>
                    <div className="w-1/3">
                        <TextFormField form={formMethods} fieldName="phone" fieldLabel="Phone Number" />
                    </div>
                    <div className="w-1/3">
                        <NumericalFormField form={formMethods} fieldName="age" fieldLabel="Patient Age" />
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="w-1/3">
                        <TextFormField form={formMethods} fieldName="location" fieldLabel="Location" />
                    </div>
                    <div className="w-1/3">
                        <TextFormField form={formMethods} fieldName="language" fieldLabel="Spoken Language" />
                    </div>
                </div>
                <TextFormField form={formMethods} fieldName="occupation" fieldLabel="Job/Occupation" />
                <TextFormField form={formMethods} fieldName="complaint" fieldLabel="Chief Complaint" />
                <TextAreaFormField form={formMethods} fieldName="diagnosis" fieldLabel="Patient Diagnosis" />
                <TextAreaFormField form={formMethods} fieldName="icd10" fieldLabel="ICD-10" />
                <DatePickerFormField form={formMethods} fieldName="surgeryDate" fieldLabel="Date of Surgery" />
                <div className="flex space-x-4">
                    <div className="w-1/2 space-y-3">
                        <SelectFormField form={formMethods} fieldName="laterality" fieldLabel="Laterality" selectOptions={['Bilateral', 'Left', 'Right']} />
                        <SelectFormField form={formMethods} fieldName="priority" fieldLabel="Priority" selectOptions={['Routine', 'Moderate', 'Urgent', 'Emergency']} />
                    </div>
                    <div className="w-1/2 space-y-3">
                        <SelectFormField form={formMethods} fieldName="baselineAmbu" fieldLabel="Baseline Ambu" selectOptions={['Independent', 'Boot', 'Crutches', 'Walker', 'Non-Ambulatory']} />
                        <SelectFormField form={formMethods} fieldName="hospital" fieldLabel="Hospital" selectOptions={['PMC', 'PRCS', 'Hugo Chavez']} />
                    </div>
                </div>
                <MedicationSelection form={formMethods} fieldName="medx" fieldLabel="Medications Needed" />
                <PMHxSelect form={formMethods} fieldName="pmhx" fieldLabel="PMHx" fieldCompact="PMHx" PopOverComponent={null} />
                <PSHxSelect form={formMethods} fieldName="pshx" fieldLabel="PSHx" fieldCompact="PSHx" PopOverComponent={null} />
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <TextFormField form={formMethods} fieldName="smokeCount" fieldLabel="Smoking Status (packs per day)" />
                    </div>
                    <div className="w-1/2">
                        <TextFormField form={formMethods} fieldName="drinkCount" fieldLabel="Avg Drinks per week" />
                    </div>
                </div>
                <TextFormField form={formMethods} fieldName="otherDrugs" fieldLabel="Other illicit uses" />
                <TextFormField form={formMethods} fieldName="allergies" fieldLabel="Allergies" />
                <TextAreaFormField form={formMethods} fieldName="notes" fieldLabel="Notes" />
                <Button type="submit">Submit Request</Button>
            </form>
        </FormProvider>
    );
}

export default PatientForm;
