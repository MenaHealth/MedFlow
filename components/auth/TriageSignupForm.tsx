'use client'

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { useSignupContext } from './SignupContext';
import { Calendar } from "@/components/ui/calendar"
import { DatePickerFormField } from "@/components/form/DatePickerFormField"

const triageSignupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.date({
        required_error: "Date of birth is required",
        invalid_type_error: "That's not a valid date",
    }),
});

export type TriageSignupFormValues = z.infer<typeof triageSignupSchema>;

const TriageSignupForm: React.FC = () => {
    const { formData, setFormData, updateAnsweredQuestions, setTriageSignupFormCompleted } = useSignupContext();
    const form = useForm<TriageSignupFormValues>({
        resolver: zodResolver(triageSignupSchema),
        defaultValues: {
            firstName: formData.firstName || '',
            lastName: formData.lastName || '',
            dob: formData.dob ? new Date(formData.dob) : undefined,
        },
        mode: "onChange",
    });

    useEffect(() => {
        const subscription = form.watch((data) => {
            setFormData((prevData) => ({ ...prevData, ...data }));
            const filledFields = Object.values(data).filter(Boolean).length;
            updateAnsweredQuestions(3, filledFields);
            const isFormComplete = filledFields === 3;
            setTriageSignupFormCompleted(isFormComplete);
        });

        return () => subscription.unsubscribe();
    }, [form, setFormData, setTriageSignupFormCompleted, updateAnsweredQuestions]);

    return (
        <div className="max-w-md mx-auto">
            <FormProvider {...form}>
                <form className="space-y-6">
                    <TextFormField
                        fieldName="firstName"
                        fieldLabel="First Name"
                        id="firstName"
                        autoComplete="given-name"
                    />
                    <TextFormField
                        fieldName="lastName"
                        fieldLabel="Last Name"
                        id="lastName"
                        autoComplete="family-name"
                    />
                    <DatePickerFormField
                        fieldName="dob"
                        fieldLabel="Date of Birth"
                        form={form}
                    />
                </form>
            </FormProvider>
        </div>
    );
};

export default TriageSignupForm;