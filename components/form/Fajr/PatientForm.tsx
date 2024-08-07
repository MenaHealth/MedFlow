// components/form/Fajr/PatientForm.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import * as React from "react";
import { TextFormField } from "@/components/form/TextFormField";
import { NumericalFormField } from "../NumericalFormField";
import { TextAreaFormField } from "../TextAreaFormField";
import { MedicationSelection } from "../MedicationSelection";
import { DatePickerFormField } from "../DatePickerFormField";
import { SelectFormField } from "../SelectFormField";
import { PMHxSelect } from "../PMHxSelection";
import { PSHxSelect } from "../PSHxSelection";
import { convertToWebP, calculateFileHash } from "../../../utils/encryptPhoto";

const patientFormSchema = z.object({
    patientId: z.string(),
    patientName: z.string(),
    age: z.number(),
    gender: z.enum(['Male', 'Female']),
    chiefComplaint: z.string(),
    diagnosis: z.string(),
    icd10: z.string(),
    surgeryDate: z.instanceof(Date),
    occupation: z.string(),
    baselineAmbu: z.enum(['Independent', 'Boot', 'Crutches', 'Walker', 'Non-Ambulatory']),
    laterality: z.enum(['Bilateral', 'Left', 'Right']),
    priority: z.enum(['Low', 'Medium', 'High']),
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
});

type PatientFormValues = z.infer<typeof patientFormSchema>
const defaultValues: Partial<PatientFormValues> = {
    patientId: "",
    patientName: "",
    age: 0,
    diagnosis: "",
    chiefComplaint: "",
    icd10: "",
    surgeryDate: new Date(),
    occupation: "",
    laterality: "Bilateral",
    priority: "Low",
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
}

export function PatientForm({ id }: { id: string } = { id: '' }) {

    const [patientData, setPatientData] = React.useState<Partial<PatientFormValues>>(defaultValues);

    React.useEffect(() => {
        if (id !== '') {
            fetch(`/api/patient/${id}`)
                .then(response => response.json())
                .then(data => {
                    data.surgeryDate = new Date(data.surgeryDate);
                    data.medx = data.medx.map((med: any) => {
                        return {
                            medName: med.medName,
                            medDosage: med.medDosage,
                            medFrequency: med.medFrequency,
                        };
                    });
                    data.age = parseInt(data.age);
                    setPatientData(data);
                    console.log(data);
                })
                .catch(error => {
                    alert('Error: ' + error.message);
                });
        }
    }, [id]);

    const form = useForm<PatientFormValues>({
        resolver: zodResolver(patientFormSchema),
        defaultValues,
    });

    React.useEffect(() => {
        form.reset(patientData);
    }, [patientData, form]);

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
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <TextFormField fieldName="patientName" fieldLabel="Patient Name" />
                <div className="flex space-x-4">
                    <div className="w-2/3">
                        <TextFormField fieldName="patientId" fieldLabel="Patient ID" />
                    </div>
                    <div className="w-1/3">
                        <NumericalFormField fieldName="age" fieldLabel="Patient Age" />
                    </div>
                </div>
                <TextFormField fieldName="occupation" fieldLabel="Job/Occupation" />
                <TextAreaFormField fieldName="chiefComplaint" fieldLabel="Patient chief complaint" />
                <TextAreaFormField fieldName="diagnosis" fieldLabel="Patient Diagnosis" />
                <TextAreaFormField fieldName="icd10" fieldLabel="ICD-10" />
                <DatePickerFormField fieldName="surgeryDate" fieldLabel="Date of Surgery" />
                <div className="flex space-x-4">
                    <div className="w-1/2 space-y-3">
                        <SelectFormField fieldName="laterality" fieldLabel="Laterality" selectOptions={['Bilateral', 'Left', 'Right']} />
                        <SelectFormField fieldName="priority" fieldLabel="Priority" selectOptions={['Low', 'Medium', 'High']} />
                    </div>
                    <div className="w-1/2 space-y-3">
                        <SelectFormField fieldName="baselineAmbu" fieldLabel="Baseline Ambu" selectOptions={['Independent', 'Boot', 'Crutches', 'Walker', 'Non-Ambulatory']} />
                        <SelectFormField fieldName="hospital" fieldLabel="Hospital" selectOptions={['PMC', 'PRCS', 'Hugo Chavez']} />
                    </div>
                </div>
                <MedicationSelection fieldName="medx" fieldLabel="Medications Needed" />
                <PMHxSelect fieldName="pmhx" fieldLabel="PMHx" fieldCompact="PMHx" PopOverComponent={null} />
                <PSHxSelect fieldName="pshx" fieldLabel="PSHx" fieldCompact="PSHx" PopOverComponent={null} />
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <TextFormField fieldName="smokeCount" fieldLabel="Smoking Status (packs per day)" />
                    </div>
                    <div className="w-1/2">
                        <TextFormField fieldName="drinkCount" fieldLabel="Avg Drinks per week" />
                    </div>
                </div>
                <TextFormField fieldName="otherDrugs" fieldLabel="Other illicit uses" />
                <TextFormField fieldName="allergies" fieldLabel="Allergies" />
                <TextAreaFormField fieldName="notes" fieldLabel="Notes" />
                <Button type="submit">Submit Patient</Button>
            </form>
        </FormProvider>
    );
}

export default PatientForm;