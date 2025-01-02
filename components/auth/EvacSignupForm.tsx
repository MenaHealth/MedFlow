'use client';

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { DatePickerFormField } from "@/components/form/DatePickerFormField";
import { useSignupContext } from "./SignupContext";
import { CountriesList } from "../../data/countries.enum";
import { MultiChoiceFormField } from "../../components/form/MultiChoiceFormField";
import { SingleChoiceFormField } from "../../components/form/SingleChoiceFormField";


const evacSignupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string().refine((value) => {
        const date = new Date(value);
        return !isNaN(date.getTime()) && date < new Date();
    }, {
        message: "Please enter a valid date of birth in the past",
    }),
    countries: z.array(z.string()).min(1, "At least one country is required"),
    gender: z.enum(['male', 'female'], { errorMap: () => ({ message: "Gender is required" }) }),
});

export type EvacSignupFormValues = z.infer<typeof evacSignupSchema>;

const EvacSignupForm: React.FC = () => {
    const { formData, setFormData, updateAnsweredQuestions, setEvacSignupFormCompleted } = useSignupContext();
    const methods = useForm<EvacSignupFormValues>({
        resolver: zodResolver(evacSignupSchema),
        defaultValues: {
            firstName: formData.firstName || '',
            lastName: formData.lastName || '',
            dob: formData.dob || '',
            countries: formData.countries || [],
            gender: formData.gender || undefined,
        },
        mode: "onChange",
    });

    useEffect(() => {
        const subscription = methods.watch((data) => {
            setFormData((prevData) => ({
                ...prevData,
                ...data,
                countries: data.countries?.filter(Boolean) as string[],
            }));

            const filledFields = [
                data.firstName,
                data.lastName,
                data.dob,
                data.countries && data.countries.length > 0,
                data.gender,
            ].filter(Boolean).length;

            updateAnsweredQuestions(3, filledFields); // Adjust step index if necessary
            const isFormComplete = filledFields === 5;

            setEvacSignupFormCompleted(isFormComplete);
        });

        return () => subscription.unsubscribe();
    }, [methods, setFormData, updateAnsweredQuestions, setEvacSignupFormCompleted]);

    return (
        <div className="max-w-md mx-auto">
            <FormProvider {...methods}>
                <form className="space-y-6">
                    <TextFormField
                        fieldName="firstName"
                        fieldLabel="First Name"
                        autoComplete="given-name"
                    />
                    <TextFormField
                        fieldName="lastName"
                        fieldLabel="Last Name"
                        autoComplete="family-name"
                    />
                    <DatePickerFormField
                        name="dob"
                        label="Date of Birth"
                        type="past"
                    />
                    <MultiChoiceFormField
                        fieldName="countries"
                        fieldLabel="Countries of Focus"
                        choices={CountriesList}
                    />
                    <SingleChoiceFormField
                        fieldName="gender"
                        fieldLabel="Gender"
                        choices={["male", "female"]}
                    />
                </form>
            </FormProvider>
        </div>
    );
};

export default EvacSignupForm;
