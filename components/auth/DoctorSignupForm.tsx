import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { DoctorSpecialty } from '@/utils/doctorSpecialty.enum';
import { MultiChoiceFormField } from "@/components/form/MultiChoiceFormField";
import { useSignupContext } from './SignupContext';
import Submit from "@/components/auth/Submit";

const doctorSignupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    doctorSpecialty: z.array(z.string()).min(1, "At least one specialty is required"),
    languages: z.array(z.string()).min(1, "At least one language is required"),
    countries: z.array(z.string()).min(1, "At least one country is required"),
    gender: z.enum(['male', 'female'], { errorMap: () => ({ message: "Gender is required" }) }),
});

export type DoctorSignupFormValues = z.infer<typeof doctorSignupSchema>;

const DoctorSignupForm: React.FC = () => {
    const { formData, setFormData, setIsFormComplete, accountType } = useSignupContext();

    const form = useForm<DoctorSignupFormValues>({
        resolver: zodResolver(doctorSignupSchema),
        defaultValues: {
            firstName: formData.firstName || '',
            lastName: formData.lastName || '',
            dob: formData.dob || '',
            doctorSpecialty: formData.doctorSpecialty || [],
            languages: formData.languages || [],
            countries: formData.countries || [],
            gender: formData.gender || undefined,
        },
    });

    useEffect(() => {
        const subscription = form.watch((data) => {
            setFormData((prevData) => ({ ...prevData, ...data }));
            const isValid = Object.keys(form.formState.errors).length === 0;
            setIsFormComplete(isValid);
        });

        return () => subscription.unsubscribe();
    }, [form, setFormData, setIsFormComplete]);

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
                    <TextFormField
                        fieldName="dob"
                        fieldLabel="Date of Birth (MM/DD/YYYY)"
                        type="date"
                        id="dob"
                        autoComplete="bday"
                    />
                    <MultiChoiceFormField
                        fieldName="languages"
                        fieldLabel="Languages"
                        choices={["English", "Arabic", "Farsi", "Pashto", "Turkish", "Urdu", "Spanish", "French"]}
                    />
                    <MultiChoiceFormField
                        fieldName="countries"
                        fieldLabel="Countries"
                        choices={["Egypt", "Palestine - West Bank", "Syria", "Yemen", "Afghanistan"]}
                    />
                    <MultiChoiceFormField
                        fieldName="doctorSpecialty"
                        fieldLabel="Please select your specialty"
                        choices={Object.values(DoctorSpecialty)}
                    />
                    <MultiChoiceFormField
                        fieldName="gender"
                        fieldLabel="Please select your gender"
                        choices={["male", "female"]}
                        custom={false}
                    />
                </form>
                <Submit />
            </FormProvider>
        </div>
    );
};

export default DoctorSignupForm;