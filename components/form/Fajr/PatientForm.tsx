"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { TextFormField } from "@/components/form/TextFormField"
import { z } from "zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
} from "@/components/ui/form"
import { NumericalFormField } from "../NumericalFormField"
import { TextAreaFormField } from "../TextAreaFormField"
import { MedicationSelection } from "../MedicationSelection"
import { DatePickerFormField, DatePopover } from "../DatePickerFormField"
import { SelectFormField } from "../SelectFormField"
import { TableSelect } from "../TableSelectTemplate"
import { MedicationPopover } from "../MedicationPopover"
import { PMHxSelect } from "../PMHxSelection"
import { PSHxSelect } from "../PSHxSelection"

const patientFormSchema = z.object({
    patientName: z.string(),
    patientAge: z.number(),
    diagnosis: z.string(),
    icd10: z.string(),
    dateOfSurgery: z.string(),
    occupation: z.string(),
    baselineAmbu: z.string(),
    medicationList: z.array(z.object({
        medName: z.string(),
        medDosage: z.string(),
        medFrequency: z.string(),
    })),
    pmhxList: z.array(z.object({
        pmhxName: z.string()
    })),
    pshxList: z.array(z.object({
        pshxDate: z.string()
    })),
    smokingStatus: z.number(),
    alcohol: z.number(),
    otherIllicit: z.string(),
    allergies: z.string(),
    notes: z.string(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>
const defaultValues: Partial<PatientFormValues> = {
    patientName: "",
    patientAge: 0,
    diagnosis: "",
    icd10: "",
    dateOfSurgery: new Date().toISOString().split("T")[0],
    occupation: "",
    baselineAmbu: "",
    medicationList: [],
    pmhxList: [],
    pshxList: [],
    smokingStatus: 0,
    alcohol: 0,
    otherIllicit: "",
    allergies: "",
    notes: "",
}
export function PatientForm() {

    const form = useForm<PatientFormValues>({
        resolver: zodResolver(patientFormSchema),
        defaultValues,
    });
    
    function onSubmit(data: PatientFormValues) {
        // show a popup with the values
        alert(JSON.stringify(data, null, 2));
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <TextFormField form={form} fieldName="patientName" fieldLabel="Patient Full Name" />
                <NumericalFormField form={form} fieldName="patientAge" fieldLabel="Patient Age" />
                <TextAreaFormField form={form} fieldName="diagnosis" fieldLabel="Patient Diagnosis" />
                <TextAreaFormField form={form} fieldName="icd10" fieldLabel="ICD-10" />
                <DatePickerFormField form={form} fieldName="dateOfSurgery" fieldLabel="Date of Surgery" />
                <TextFormField form={form} fieldName="occupation" fieldLabel="Job/Occupation" />
                <SelectFormField form={form} fieldName="baselineAmbu" fieldLabel="Baseline Ambu" />
                <MedicationSelection form={form} fieldName="medicationList" fieldLabel="Medications Needed" />
                <PMHxSelect form={form} fieldName="pmhxList" fieldLabel="PMHx" fieldCompact="PMHx" PopOverComponent={null} />
                <PSHxSelect form={form} fieldName="pshxList" fieldLabel="PSHx" fieldCompact="PSHx" PopOverComponent={DatePopover} />
                <NumericalFormField form={form} fieldName="smokingStatus" fieldLabel="Smoking Status (packs per day)" />
                <NumericalFormField form={form} fieldName="alcohol" fieldLabel="Avg Drinks per week" />
                <TextFormField form={form} fieldName="otherIllicit" fieldLabel="Other illicit uses" />
                <TextFormField form={form} fieldName="allergies" fieldLabel="Allergies" />
                <TextAreaFormField form={form} fieldName="notes" fieldLabel="Notes" />

                <Button type="submit">Submit Request</Button>
                </form>
            </Form>
        </>
    );
}