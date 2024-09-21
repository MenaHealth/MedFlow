import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { MultiChoiceFormField } from "@/components/form/MultiChoiceFormField";
import { SingleChoiceFormField } from "@/components/form/SingleChoiceFormField";
import { DoctorSpecialtyList } from '@/utils/doctorSpecialty.enum';
import { languagesList } from '@/utils/languages.enum';
import { CountriesList } from '@/utils/countries.enum';

import { useSignupContext } from './SignupContext';

const doctorSignupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    doctorSpecialty: z.string().min(1, "Specialty is required"),
    languages: z.array(z.string()).min(1, "At least one language is required"),
    countries: z.array(z.string()).min(1, "At least one country is required"),
    gender: z.enum(['male', 'female'], { errorMap: () => ({ message: "Gender is required" }) }),
});

export type DoctorSignupFormValues = z.infer<typeof doctorSignupSchema>;

const DoctorSignupForm: React.FC = () => {
    const { formData, setFormData, updateAnsweredQuestions, setDoctorSignupFormCompleted } = useSignupContext();
    const form = useForm<DoctorSignupFormValues>({
        resolver: zodResolver(doctorSignupSchema),
        defaultValues: {
            firstName: formData.firstName || '',
            lastName: formData.lastName || '',
            dob: formData.dob || '',
            doctorSpecialty: formData.doctorSpecialty || '',
            languages: formData.languages || [],
            countries: formData.countries || [],
            gender: formData.gender || undefined,
        },
        mode: "onChange",
    });

    useEffect(() => {
        const subscription = form.watch((data) => {
            const cleanedData = {
                ...data,
                languages: data.languages?.filter((language) => language !== undefined) || [],  // Remove undefined values
                countries: data.countries?.filter((country) => country !== undefined) || [],   // Remove undefined values
            };

            setFormData((prevData) => ({
                ...prevData,
                ...cleanedData,
            }));

            const filledFields = Object.entries(cleanedData).filter(([key, value]) => {
                if (Array.isArray(value)) {
                    return value.length > 0;
                }
                return !!value;
            }).length;

            const isFormComplete = filledFields === 7;
            setDoctorSignupFormCompleted(isFormComplete);
        });

        return () => subscription.unsubscribe();
    }, [form, setFormData, setDoctorSignupFormCompleted, updateAnsweredQuestions]);

    return (
        <div className="max-w-md mx-auto">
            <FormProvider {...form}>
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
                    <TextFormField
                        fieldName="dob"
                        fieldLabel="Date of Birth (MM/DD/YYYY)"
                        type="date"
                        autoComplete="bday"
                    />
                    <MultiChoiceFormField
                        fieldName="languages"
                        fieldLabel="Languages"
                        choices={languagesList}
                    />
                    <MultiChoiceFormField
                        fieldName="countries"
                        fieldLabel="Countries"
                        choices={CountriesList}
                    />
                    <SingleChoiceFormField
                        fieldName="doctorSpecialty"
                        fieldLabel="Doctor Specialty"
                        choices={Object.values(DoctorSpecialtyList)}
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

export default DoctorSignupForm;