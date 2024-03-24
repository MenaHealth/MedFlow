"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { TextFormField } from "@/components/form/TextFormField"
import { z } from "zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
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
import { TextAreaFormField } from "./TextAreaFormField"
import { MedicationSelection } from "./MedicationSelection"
const doctorFormSchema = z.object({
    doctorName: z.string(),
    patientName: z.string(),
    patientPhoneNumber: z.string(),
    specialty: z.string(),
    patientAddress: z.string(),
    diagnosis: z.string(),
    medicationList: z.array(z.object({
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
    medicationList: [{medName: "", medDosage: "", medFrequency: ""}],
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
                <TextFormField form={form} fieldName="doctorName" fieldLabel="Doctor(s) Full Name" />
                <MultiChoiceFormField form={form} fieldName="specialty" fieldLabel="Specialty" custom={true} choices={["Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", "Hematology", "Infectious Disease", "Nephrology", "Neurology", "Oncology", "Pulmonology", "Rheumatology", "Urology"]} cols={3} />
                <TextFormField form={form} fieldName="patientName" fieldLabel="Patient's Full Name" />
                <TextFormField form={form} fieldName="patientPhoneNumber" fieldLabel="Patient's Phone Number" />
                <MultiChoiceFormField form={form} fieldName="patientAddress" fieldLabel="Patient's Address" custom={false} choices={["North Gaza", "Gaza City", "Deir Al Balah", "Khan Yunis", "Rafah"]} cols={3} />
                <TextAreaFormField form={form} fieldName="diagnosis" fieldLabel="Patient Diagnosis" />
                <MedicationSelection form={form} fieldLabel="Medicine" fieldName="medicationList"  />
                <MultiChoiceFormField form={form} fieldName="urgency" fieldLabel="Rate the Urgency" custom={false} choices={["Extremely urgent: vital prognosis at risk", "Urgent: functional prognosis at risk", "Moderately urgent: can wait for few days-weeks", 
                "Less urgent: can wait", "Not urgent"]} />
                <Button type="submit">Submit Request</Button>
                </form>
            </Form>
        </>
    );
}