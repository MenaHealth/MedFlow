"use client";
// components/form/NewPatientForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { NumericalFormField } from "@/components/form/NumericalFormField";
import { TextAreaFormField } from "@/components/ui/TextAreaFormField";
import { PhoneFormField } from "@/components/form/PhoneFormField";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SelectFormField } from "./SelectFormField";
import { LanguagesList } from "@/data/languages.enum";
import { CountriesList } from "@/data/countries.enum";
import { RadioGroupField } from "@/components/form/RadioGroupField";
import { useSession } from "next-auth/react";

const newPatientFormSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(1, "Phone number is required"),
    age: z.number().min(0, "Please enter a number greater than 0"),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    language: z.string().min(1, "Language is required"),
    chiefComplaint: z.string().min(1, "Please enter the main reason you seek medical care"),
    email: z.string().email(),
    genderPreference: z.string().min(1, "Please select a gender preference"),
    previouslyRegistered: z.string().min(1, "Please select if you have previously registered with us"),
});

type NewPatientFormValues = z.infer<typeof newPatientFormSchema>;

type NewPatientFormProps = {
    handleSubmit: (formData: NewPatientFormValues) => void;
    submitting: boolean;
};

export function NewPatientForm({ handleSubmit, submitting }: NewPatientFormProps) {
    const { data: session } = useSession();

    const form = useForm<NewPatientFormValues>({
        resolver: zodResolver(newPatientFormSchema),
        defaultValues: {
            firstName: '',
            email: '',
            lastName: '',
            phone: '',
            age: 0,
            country: '',
            city: '',
            language: '',
            chiefComplaint: '',
            genderPreference: '',
            previouslyRegistered: '',
        },
    });

    const onSubmit = (data: NewPatientFormValues) => {
        console.log("Submitting data:", data);
        handleSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} onChange={() => console.log(form.getValues())} className="space-y-8">
                {/* Top row - name */}
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <TextFormField form={form} fieldName="firstName" fieldLabel="First Name" />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TextFormField form={form} fieldName="lastName" fieldLabel="Last Name" />
                    </div>
                </div>
                {/* Second row - email */}
                <TextFormField form={form} fieldName="email" fieldLabel="Email" />

                {/* Third row - age, phone, language */}
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/4">
                        <NumericalFormField form={form} fieldName="age" fieldLabel="Age" />
                    </div>
                    <div className="w-full md:w-3/8">
                        <PhoneFormField form={form} fieldName="phone" fieldLabel="Phone Number" />
                    </div>
                    <div className="w-full md:w-3/8">
                        <SelectFormField form={form} fieldName="language" fieldLabel="Language" selectOptions={LanguagesList}/>
                    </div>
                </div>

                {/* Fourth row - city, country */}
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <SelectFormField form={form} fieldName="country" fieldLabel="Country" selectOptions={CountriesList} />
                    </div>
                    <div className="w-full md:w-1/2 mt-6">
                        <TextFormField form={form} fieldName="city" fieldLabel="City" />
                    </div>
                </div>

                {/* Fifth row - Chief Complaint */}
                <TextAreaFormField form={form} fieldName="chiefComplaint" fieldLabel="Chief Complaint" />
                
                {!session && (
                    <>
                        {/* Sixth row - Gender Preference */}
                        <div className="flex flex-col mx-2">
                            <span>Do you have a preference on the gender of the doctor we connect you with?</span>
                            <RadioGroupField
                                form={form}
                                fieldName="genderPreference"
                                radioOptions={["Female", "Male", "No Preference"]}
                            />
                        </div>

                        {/* Seventh row - Previously Registered */}
                        <div className="flex flex-col mx-2">
                            <span>Has the patient been registered with us before?</span>
                            <RadioGroupField
                                form={form}
                                fieldName="previouslyRegistered"
                                radioOptions={["Yes", "No"]}
                            />
                        </div>
                    </>
                )}
                
                <div className="flex justify-center">
                    <Button type="submit" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit New Patient"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default NewPatientForm;