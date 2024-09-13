// components/auth/DoctorSignupForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { Form } from "@/components/ui/form";
import { DoctorSpecialty } from '@/utils/doctorSpecialty.enum';
import { MultiChoiceFormField } from "@/components/form/MultiChoiceFormField";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";

const doctorSignupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    doctorSpecialty: z.nativeEnum(DoctorSpecialty, { errorMap: () => ({ message: "Specialty is required" }) }),
    languages: z.array(z.string()).min(1, "At least one language is required"),
    countries: z.array(z.string()).min(1, "At least one country is required"),
    gender: z.enum(['male', 'female'], { errorMap: () => ({ message: "Gender is required" }) }),
});

type DoctorSignupFormValues = z.infer<typeof doctorSignupSchema>;

interface Props {
    onDataChange: (data: any) => void;
    formData: any;
}

const DoctorSignupForm = ({ onDataChange, formData }: Props) => {
    const form = useForm<DoctorSignupFormValues>({
        resolver: zodResolver(doctorSignupSchema),
        defaultValues: {
            firstName: formData.firstName || '',
            lastName: formData.lastName || '',
            dob: formData.dob || '',
            doctorSpecialty: formData.doctorSpecialty || DoctorSpecialty.ALLERGY_IMMUNOLOGY,
            languages: formData.languages || [],
            countries: formData.countries || [],
            gender: formData.gender || 'male',
        },
    });

    useEffect(() => {
        const subscription = form.watch((value) => {
            onDataChange(value);
        });
        return () => subscription.unsubscribe();
    }, [form, onDataChange]);

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Doctor Signup</h2>
            <Form {...form}>
                <form className="space-y-6">
                    <TextFormField form={form} fieldName="firstName" fieldLabel="First Name" />
                    <TextFormField form={form} fieldName="lastName" fieldLabel="Last Name" />
                    <TextFormField form={form} fieldName="dob" fieldLabel="Date of Birth (MM/DD/YYYY)" type="date" />
                    <MultiChoiceFormField
                        form={form}
                        fieldName="doctorSpecialty"
                        fieldLabel="Please select your medical specialty"
                        choices={Object.values(DoctorSpecialty)}
                        custom={false}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                        {["English", "Arabic", "Farsi", "Pashto", "Turkish", "Urdu", "Spanish", "French"].map((lang) => (
                            <div key={lang} className="flex items-center space-x-2 mb-2">
                                <Checkbox
                                    id={`lang-${lang}`}
                                    checked={form.watch('languages').includes(lang)}
                                    onCheckedChange={(checked) => {
                                        const currentLangs = form.getValues('languages');
                                        if (checked) {
                                            form.setValue('languages', [...currentLangs, lang]);
                                        } else {
                                            form.setValue('languages', currentLangs.filter(l => l !== lang));
                                        }
                                    }}
                                />
                                <label htmlFor={`lang-${lang}`} className="text-sm text-gray-700">{lang}</label>
                            </div>
                        ))}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Countries</label>
                        {["Egypt", "Palestine - West Bank", "Syria", "Yemen", "Afghanistan"].map((country) => (
                            <div key={country} className="flex items-center space-x-2 mb-2">
                                <Checkbox
                                    id={`country-${country}`}
                                    checked={form.watch('countries').includes(country)}
                                    onCheckedChange={(checked) => {
                                        const currentCountries = form.getValues('countries');
                                        if (checked) {
                                            form.setValue('countries', [...currentCountries, country]);
                                        } else {
                                            form.setValue('countries', currentCountries.filter(c => c !== country));
                                        }
                                    }}
                                />
                                <label htmlFor={`country-${country}`} className="text-sm text-gray-700">{country}</label>
                            </div>
                        ))}
                    </div>
                    <MultiChoiceFormField
                        form={form}
                        fieldName="gender"
                        fieldLabel="Please select your gender"
                        choices={["male", "female"]}
                        custom={false}
                    />
                </form>
            </Form>
        </div>
    );
};

export default DoctorSignupForm;