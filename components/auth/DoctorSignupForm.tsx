    import React, { useEffect } from "react";
    import { useForm, FormProvider } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { z } from "zod";
    import { TextFormField } from "../../components/ui/TextFormField";
    import { MultiChoiceFormField } from "../../components/form/MultiChoiceFormField";
    import { SingleChoiceFormField } from "../../components/form/SingleChoiceFormField";
    import { DatePickerFormField } from "../../components/form/DatePickerFormField";
    import { DoctorSpecialties } from '../../data/doctorSpecialty.enum';
    import { LanguagesList } from '../../data/languages.enum';
    import { CountriesList } from '../../data/countries.enum';
    import { useSignupContext } from './SignupContext';

    const doctorSignupSchema = z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        dob: z.string().refine((value) => {
            const date = new Date(value);
            return !isNaN(date.getTime()) && date < new Date();
        }, {
            message: "Please enter a valid date of birth in the past",
        }),
        doctorSpecialty: z.string().min(1, "Specialty is required"),
        languages: z.array(z.string()).min(1, "At least one language is required"),
        countries: z.array(z.string()).min(1, "At least one country is required"),
        gender: z.enum(['male', 'female'], { errorMap: () => ({ message: "Gender is required" }) }),
    });

    export type DoctorSignupFormValues = z.infer<typeof doctorSignupSchema>;

    const DoctorSignupForm: React.FC = () => {
        const { formData, setFormData, updateAnsweredQuestions, setDoctorSignupFormCompleted } = useSignupContext();
        const methods = useForm<DoctorSignupFormValues>({
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
            const subscription = methods.watch((data) => {

                setFormData((prevData) => ({
                    ...prevData,
                    ...data,
                    languages: data.languages?.filter(Boolean) as string[],
                    countries: data.countries?.filter(Boolean) as string[]
                }));

                const filledFields = [
                    data.firstName,
                    data.lastName,
                    data.dob,
                    data.doctorSpecialty,
                    data.languages && data.languages.length > 0,
                    data.countries && data.countries.length > 0,
                    data.gender
                ].filter(Boolean).length;


                // Adjust the step number from 7 to the correct index
                updateAnsweredQuestions(3, filledFields); // Correct the step index

                const isFormComplete = filledFields === 7;

                setDoctorSignupFormCompleted(isFormComplete);
            });

            return () => subscription.unsubscribe();
        }, [methods, setFormData, updateAnsweredQuestions, setDoctorSignupFormCompleted]);

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
                            fieldName="languages"
                            fieldLabel="Languages"
                            choices={LanguagesList}
                        />
                        <MultiChoiceFormField
                            fieldName="countries"
                            fieldLabel="Countries"
                            choices={CountriesList}
                        />
                        <SingleChoiceFormField
                            fieldName="doctorSpecialty"
                            fieldLabel="Doctor Specialty"
                            choices={DoctorSpecialties}
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