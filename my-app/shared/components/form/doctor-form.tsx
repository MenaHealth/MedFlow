"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { TextFormField } from "@/components/ui/TextFormField"
import { z } from "zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { MultiChoiceFormField } from "./MultiChoiceFormField"
import { TextAreaFormField } from "../ui/TextAreaFormField"
const doctorFormSchema = z.object({
    doctorName: z.string(),
    patientName: z.string(),
    patientPhoneNumber: z.string(),
    specialty: z.string(),
    patientAddress: z.string(),
    diagnosis: z.string(),
    medx: z.array(z.object({
        medName: z.string(),
        medDosage: z.string(),
        medFrequency: z.string(),
    })),
    urgency: z.string(),
});

type DoctorFormValues = z.infer<typeof doctorFormSchema>
const defaultValues: Partial<DoctorFormValues> = {
    doctorName: "",
    patientName: "",
    patientPhoneNumber: "",
    specialty: "",
    patientAddress: "",
    diagnosis: "",
    medx: [{medName: "", medDosage: "", medFrequency: ""}],
    urgency: "",
}
export function DoctorForm() {

    const form = useForm<DoctorFormValues>({
        resolver: zodResolver(doctorFormSchema),
        defaultValues,
    });
    
    function onSubmit(data: DoctorFormValues) {
        // show a popup with the values
        alert(JSON.stringify(data, null, 2));
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <TextFormField fieldName="doctorName" fieldLabel="Doctor(s) Full Name" />
                <MultiChoiceFormField fieldName="specialty" fieldLabel="Specialty" choices={["Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", "Hematology", "Infectious Disease", "Nephrology", "Neurology", "Oncology", "Pulmonology", "Rheumatology", "Urology"]} />
                <TextFormField fieldName="patientName" fieldLabel="Patient's Full Name" />
                <TextFormField fieldName="patientPhoneNumber" fieldLabel="Patient's Phone Number" />
                <MultiChoiceFormField fieldName="patientAddress" fieldLabel="Patient's Address" choices={["North Gaza", "Gaza City", "Deir Al Balah", "Khan Yunis", "Rafah"]} />
                <TextAreaFormField form={form} fieldName="diagnosis" fieldLabel="Patient Diagnosis" />
                <MultiChoiceFormField fieldName="urgency" fieldLabel="Rate the Urgency" choices={["Extremely urgent: vital prognosis at risk", "Urgent: functional prognosis at risk", "Moderately urgent: can wait for few days-weeks",
                "Less urgent: can wait", "Not urgent"]} />
                <Button type="submit">Submit Request</Button>
                </form>
            </Form>
        </>
    );
}