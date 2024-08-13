"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TextFormField } from "@/components/form/TextFormField";
import { NumericalFormField } from "@/components/form/NumericalFormField";
import { TextAreaFormField } from "@/components/form/TextAreaFormField";
import { PhoneFormField } from "@/components/form/PhoneFormField";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { SPECIALTIES } from '@/data/data';

const newPatientFormSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z.string().regex(/^\d+$/, "Phone number must contain only digits"),
    age: z.number().min(0, "Age must be a positive number"),
    location: z.string().min(1, "Location is required"),
    language: z.string().min(1, "Language is required"),
    chiefComplaint: z.string().min(1, "Chief complaint is required"),
});

type NewPatientFormValues = z.infer<typeof newPatientFormSchema>;

type NewPatientProps = {
    handleSubmit: (formData: Partial<NewPatientFormValues> & { patientId: string }) => void;
    submitting: boolean;
};

const defaultValues: Partial<NewPatientFormValues> = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    age: 0,
    location: "",
    language: "",
    chiefComplaint: "",
};

export function NewPatient({ handleSubmit, submitting }: NewPatientProps) {
    const form = useForm<NewPatientFormValues>({
        resolver: zodResolver(newPatientFormSchema),
        defaultValues,
    });

    const onSubmit = (data: NewPatientFormValues) => {
        console.log("Submitting data:", data);
        const patientId = uuidv4();

        const fullPatientData = {
            ...data,
            patientId,
        };

        console.log("Full patient data:", fullPatientData);
        handleSubmit(fullPatientData);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <TextFormField form={form} fieldName="firstName" fieldLabel="First Name" />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TextFormField form={form} fieldName="lastName" fieldLabel="Last Name" />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <NumericalFormField form={form} fieldName="age" fieldLabel="Age" />
                    </div>
                    <div className="w-full md:w-1/2">
                        <PhoneFormField form={form} fieldName="phoneNumber" fieldLabel="Phone Number" />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <TextFormField form={form} fieldName="language" fieldLabel="Language" />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TextFormField form={form} fieldName="location" fieldLabel="Location" />
                    </div>
                </div>
                <TextAreaFormField form={form} fieldName="chiefComplaint" fieldLabel="Chief Complaint" />
                <div className="flex justify-center">
                    <Button type="submit" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit New Patient"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default NewPatient;