'use client'

'use client'

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { useSignupContext } from './SignupContext';
import { DatePickerFormField } from "@/components/form/DatePickerFormField"

const triageSignupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string()
        .refine((value) => {
            const date = new Date(value);
            return !isNaN(date.getTime()) && date < new Date();
        }, {
            message: "Please enter a valid date of birth in the past",
        }),
});

export type TriageSignupFormValues = z.infer<typeof triageSignupSchema>;

const TriageSignupForm: React.FC = () => {
    const { formData, setFormData, updateAnsweredQuestions, setTriageSignupFormCompleted } = useSignupContext();
    const methods = useForm<TriageSignupFormValues>({
        resolver: zodResolver(triageSignupSchema),
        defaultValues: {
            firstName: formData.firstName || '',
            lastName: formData.lastName || '',
            dob: formData.dob || '',
        },
        mode: "onChange",
    });

    useEffect(() => {
        const subscription = methods.watch((data) => {
            setFormData((prevData) => ({
                ...prevData,
                ...data,
            }));

            const filledFields = Object.values(data).filter(Boolean).length;
            updateAnsweredQuestions(3, filledFields); // Instead of 7
            const isFormComplete = filledFields === 3;
            setTriageSignupFormCompleted(isFormComplete);
        });

        return () => subscription.unsubscribe();
    }, [methods, setFormData, setTriageSignupFormCompleted, updateAnsweredQuestions]);

    return (
        <div className="max-w-md mx-auto">
            <FormProvider {...methods}>
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
                        name="dob"
                        label="Date of Birth"
                        type="past"
                    />
                </form>
            </FormProvider>
        </div>
    );
};

export default TriageSignupForm;