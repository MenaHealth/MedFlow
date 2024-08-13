// components/form/Fajr/PatientForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TextFormField } from "@/components/form/TextFormField";
import { z } from "zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { NumericalFormField } from "../NumericalFormField";
import { TextAreaFormField } from "../TextAreaFormField";
import { MedicationSelection } from "../MedicationSelection";
import { DatePickerFormField } from "../DatePickerFormField";
import { SelectFormField } from "../SelectFormField";
import { PMHxSelect } from "../PMHxSelection";
import { PSHxSelect } from "../PSHxSelection";

const patientFormSchema = z.object({
    patientId: z.string(),
    age: z.number().min(0, "Age must be a positive number").optional(),
    diagnosis: z.string().optional(),
    icd10: z.string().optional(),
    surgeryDate: z.instanceof(Date).optional(),
    occupation: z.string().optional(),
    baselineAmbu: z.enum(["Independent", "Boot", "Crutches", "Walker", "Non-Ambulatory"]).optional(),
    laterality: z.enum(["Bilateral", "Left", "Right"]).optional(),
    priority: z.enum(["Low", "Medium", "High"]).optional(),
    hospital: z.enum(["Not Selected", "PMC", "PRCS", "Hugo Chavez"]).optional(),
    medx: z
        .array(
            z.object({
                medName: z.string().optional(),
                medDosage: z.string().optional(),
                medFrequency: z.string().optional(),
            })
        )
        .optional(),
    pmhx: z.array(z.string()).optional(),
    pshx: z.array(z.string()).optional(),
    smokeCount: z.string().optional(),
    drinkCount: z.string().optional(),
    otherDrugs: z.string().optional(),
    allergies: z.string().optional(),
    notes: z.string().optional(),
    files: z.any().optional(),
    chiefConcern: z.string().optional(),
    phoneNumber: z.string().optional(),
    language: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

const defaultValues: Partial<PatientFormValues> = {
    patientId: "",
    age: undefined,
    diagnosis: "",
    icd10: "",
    surgeryDate: undefined,
    occupation: "",
    laterality: "Bilateral",
    priority: "Low",
    hospital: "Not Selected",
    baselineAmbu: "Independent",
    medx: [],
    pmhx: [],
    pshx: [],
    smokeCount: "",
    drinkCount: "",
    otherDrugs: "",
    allergies: "",
    notes: "",
    chiefConcern: "",
    phoneNumber: "",
    language: "",
};

export function PatientForm({ id }: { id: string } = { id: "" }) {
    const [patientData, setPatientData] = React.useState<Partial<PatientFormValues>>(defaultValues);

    React.useEffect(() => {
        if (id !== "") {
            fetch(`/api/patient/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    data.surgeryDate = data.surgeryDate ? new Date(data.surgeryDate) : undefined;
                    data.medx = data.medx.map((med: any) => ({
                        medName: med.medName || "",
                        medDosage: med.medDosage || "",
                        medFrequency: med.medFrequency || "",
                    }));
                    data.age = parseInt(data.age) || undefined;
                    setPatientData(data);
                    console.log(data);
                })
                .catch((error) => {
                    alert("Error: " + error.message);
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
        console.log("Form submitted:", data);

        const response = await fetch("/api/patient/new", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            console.log("Patient created successfully");
            window.location.href = "/patient-info/dashboard";
        } else {
            console.error("Error creating patient:", response.statusText);
            alert("Error: " + response.statusText);
        }
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex space-x-4">
                        <div className="w-2/3">
                            <TextFormField form={form} fieldName="patientId" fieldLabel="Patient ID" />
                        </div>
                        <div className="w-1/3">
                            <NumericalFormField form={form} fieldName="age" fieldLabel="Patient Age" />
                        </div>
                    </div>
                    <TextFormField form={form} fieldName="occupation" fieldLabel="Job/Occupation" />
                    <TextAreaFormField form={form} fieldName="diagnosis" fieldLabel="Patient Diagnosis" />
                    <TextAreaFormField form={form} fieldName="icd10" fieldLabel="ICD-10" />
                    <DatePickerFormField form={form} fieldName="surgeryDate" fieldLabel="Date of Surgery" />
                    <TextFormField form={form} fieldName="chiefConcern" fieldLabel="Chief Concern" /> {/* New Field */}
                    <TextFormField form={form} fieldName="phoneNumber" fieldLabel="Phone Number" /> {/* New Field */}
                    <TextFormField form={form} fieldName="language" fieldLabel="Language Spoken" /> {/* New Field */}
                    <div className="flex space-x-4">
                        <div className="w-1/2 space-y-3">
                            <SelectFormField form={form} fieldName="laterality" fieldLabel="Laterality" selectOptions={['Bilateral', 'Left', 'Right']} />
                            <SelectFormField form={form} fieldName="priority" fieldLabel="Priority" selectOptions={['Low', 'Medium', 'High']} />
                        </div>
                        <div className="w-1/2 space-y-3">
                            <SelectFormField form={form} fieldName="baselineAmbu" fieldLabel="Baseline Ambu" selectOptions={['Independent', 'Boot', 'Crutches', 'Walker', 'Non-Ambulatory']} />
                            <SelectFormField form={form} fieldName="hospital" fieldLabel="Hospital" selectOptions={['Not Selected', 'PMC', 'PRCS', 'Hugo Chavez']} />
                        </div>
                    </div>
                    <MedicationSelection form={form} fieldName="medx" fieldLabel="Medications Needed" />
                    <PMHxSelect form={form} fieldName="pmhx" fieldLabel="PMHx" fieldCompact="PMHx" PopOverComponent={null} />
                    <PSHxSelect form={form} fieldName="pshx" fieldLabel="PSHx" fieldCompact="PSHx" PopOverComponent={null} />
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <TextFormField form={form} fieldName="smokeCount" fieldLabel="Smoking Status (packs per day)" />
                        </div>
                        <div className="w-1/2">
                            <TextFormField form={form} fieldName="drinkCount" fieldLabel="Avg Drinks per week" />
                        </div>
                    </div>
                    <TextFormField form={form} fieldName="otherDrugs" fieldLabel="Other illicit uses" />
                    <TextFormField form={form} fieldName="allergies" fieldLabel="Allergies" />
                    <TextAreaFormField form={form} fieldName="notes" fieldLabel="Notes" />
                    <Button type="submit">Submit Patient Updates</Button>
                </form>
            </Form>
        </>
    );
}

export default PatientForm;