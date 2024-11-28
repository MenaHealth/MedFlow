"use client";
// components/form/NewPatientFormTelegram.tsx

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { SelectFormField } from "./SelectFormField";
import { TextAreaFormField } from "@/components/ui/TextAreaFormField";
import { PhoneFormField } from "@/components/form/PhoneFormField";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";

const newPatientFormTelegramSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.object({
        countryCode: z.string().min(1, "Country code is required"),
        phoneNumber: z.string().min(1, "Phone number is required"),
    }),
    dob: z.string(),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    language: z.string().min(1, "Language is required"),
    chiefComplaint: z.string().min(1, "Please enter the main reason you seek medical care"),
});

type NewPatientFormTelegramValues = z.infer<typeof newPatientFormTelegramSchema>;

type NewPatientFormTelegramProps = {
    handleSubmit: (formData: NewPatientFormTelegramValues) => void;
    submitting: boolean;
    language: "english" | "arabic" | "farsi" | "pashto";
    initialData?: Partial<NewPatientFormTelegramValues>;
};

export function NewPatientFormTelegram({ handleSubmit, submitting, language, initialData }: NewPatientFormTelegramProps) {
    const form = useForm<NewPatientFormTelegramValues>({
        resolver: zodResolver(newPatientFormTelegramSchema),
        defaultValues: initialData || {
            firstName: "",
            lastName: "",
            phone: { countryCode: "", phoneNumber: "" },
            dob: "",
            country: "",
            city: "",
            language: "",
            chiefComplaint: "",
        },
    });

    const onSubmit = (data: NewPatientFormTelegramValues) => {
        handleSubmit(data);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <TextFormField fieldName="firstName" fieldLabel="First Name" error={form.formState.errors.firstName?.message} />
                    <TextFormField fieldName="lastName" fieldLabel="Last Name" error={form.formState.errors.lastName?.message} />
                </div>
                <PhoneFormField form={form} fieldName="phone" fieldLabel="Phone Number" />
                <TextFormField fieldName="dob" fieldLabel="Date of Birth" type="date" />
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <SelectFormField
                        selectOptions={['USA', 'Canada', 'Mexico']}
                        form={form}
                        fieldName="country"
                        fieldLabel="Country"
                    />
                    <TextFormField fieldName="city" fieldLabel="City" />
                </div>
                <TextAreaFormField form={form} fieldName="chiefComplaint" fieldLabel="Chief Complaint" />
                <div className="flex justify-center">
                    <Button type="submit" disabled={submitting}>
                        <SendHorizonal className="mr-2 h-4 w-4" />
                        {submitting ? "Submitting..." : "Update Patient"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}