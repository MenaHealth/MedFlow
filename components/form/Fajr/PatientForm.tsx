// components/form/Fajr/Patient_form.tsx
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
import { PhoneFormField } from "@/components/form/PhoneFormField";

const patientFormSchema = z.object({
    // patientId: z.string(),
    // chiefComplaint: z.string().optional(),
    // language: z.string().optional(),
    // location: z.string().optional(),
    // age: z.number().min(0, "Age must be a positive number").optional(),
    // phone: z.string().optional(),
    diagnosis: z.string().optional(),
    icd10: z.string().optional(),
    surgeryDate: z.instanceof(Date).optional(),
    occupation: z.string().optional(),
    baselineAmbu: z.enum(["Not Selected", "Independent", "Boot", "Crutches", "Walker", "Non-Ambulatory"]).optional(),
    laterality: z.enum(["Not Selected", "Bilateral", "Left", "Right"]).optional(),
    priority: z.enum(["Not Selected", "Routine", "Moderate", "Urgent", "Emergency"]).optional(),
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
});

type PatientFormValues = z.infer<typeof patientFormSchema> & {
    firstName?: string;
    lastName?: string;
    language?: string;
    location?: string;
    age?: number;
    phone?: string;
    chiefComplaint?: string;
    password?: string;
    email?: string;
};

const defaultValues: Partial<PatientFormValues> = {
    // patientId: "",
    // chiefComplaint: "",
    // language: "",
    // location: "",
    // age: undefined,
    // phone: "",
    diagnosis: "",
    icd10: "",
    surgeryDate: undefined,
    occupation: "",
    laterality: "Not Selected",
    priority: "Not Selected",
    hospital: undefined,
    baselineAmbu: "Not Selected",
    medx: [],
    pmhx: [],
    pshx: [],
    smokeCount: "",
    drinkCount: "",
    otherDrugs: "",
    allergies: "",
    notes: "",
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
            <div className="space-y-4 mb-8">
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <label className="font-medium">First Name</label>
                        <div>{patientData.firstName}</div>
                    </div>
                    <div className="w-full md:w-1/2">
                        <label className="font-medium">Last Name</label>
                        <div>{patientData.lastName}</div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <label className="font-medium">Language</label>
                        <div>{patientData.language}</div>
                    </div>
                    <div className="w-full md:w-1/2">
                        <label className="font-medium">Location</label>
                        <div>{patientData.location}</div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <label className="font-medium">Age</label>
                        <div>{patientData.age}</div>
                    </div>
                    <div className="w-full md:w-1/2">
                        <label className="font-medium">Phone Number</label>
                        <div>{patientData.phone}</div>
                    </div>
                </div>
                <div>
                    <label className="font-medium">Chief Complaint</label>
                    <div>{patientData.chiefComplaint}</div>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <TextFormField form={form} fieldName="occupation" fieldLabel="Job/Occupation" />
                    <TextAreaFormField form={form} fieldName="diagnosis" fieldLabel="Patient Diagnosis" />
                    <TextAreaFormField form={form} fieldName="icd10" fieldLabel="ICD-10" />
                    <DatePickerFormField form={form} fieldName="surgeryDate" fieldLabel="Date of Surgery" />

                    <div className="flex space-x-4">
                        <div className="w-1/2 space-y-3">
                            <SelectFormField form={form} fieldName="laterality" fieldLabel="Laterality" selectOptions={['Bilateral', 'Left', 'Right']} />
                            <SelectFormField form={form} fieldName="priority" fieldLabel="Priority" selectOptions={['Not Selected', 'Routine', 'Moderate', 'Urgent', 'Emergency']} />
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