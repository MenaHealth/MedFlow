"use client";
// components/form/NewPatientForm.tsx
import { FormProvider, useForm, Controller } from "react-hook-form";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { NumericalFormField } from "@/components/form/NumericalFormField";
import { TextAreaFormField } from "@/components/ui/TextAreaFormField";
import { Button } from "@/components/ui/button";
import { SelectFormField } from "./SelectFormField";
import { LanguagesList, Languages, LanguagesListArabic, LanguagesListFarsi, LanguagesListPashto } from "@/data/languages.enum";
import { CountriesList, Countries, CountriesListArabic, CountriesListFarsi, CountriesListPashto } from "@/data/countries.enum";
import { RadioGroupField } from "@/components/form/RadioGroupField";
import { useSession } from "next-auth/react";
import { mapLanguageToEnglish } from "@/utils/mapLanguageToEnglish";
import { mapCountryToEnglish } from "@/utils/mapCountryToEnglish";
import { SendHorizonal } from "lucide-react";

const newPatientFormSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.object({
        countryCode: z.string().min(1, "Country code is required"),
        phoneNumber: z.string().min(1, "Phone number is required"),
    }),
    age: z.number().min(0, "Please enter a number greater than 0"),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    language: z.string().min(1, "Language is required"),
    chiefComplaint: z.string().min(1, "Please enter the main reason you seek medical care"),
    genderPreference: z.string(),
    previouslyRegistered: z.string(),
    createdAt: z.date(),
});

type NewPatientFormValues = z.infer<typeof newPatientFormSchema>;

type NewPatientFormProps = {
    handleSubmit: (formData: NewPatientFormValues) => void;
    submitting: boolean;
    language: "english" | "arabic" | "farsi" | "pashto";
};

export function NewPatientForm({ handleSubmit, submitting, language }: NewPatientFormProps) {
    const { data: session } = useSession();

    const form = useForm<NewPatientFormValues>({
        resolver: zodResolver(newPatientFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            phone: {
                countryCode: '',
                phoneNumber: '',
            },
            age: 0,
            country: '',
            city: '',
            language: '',
            chiefComplaint: '',
            genderPreference: '',
            previouslyRegistered: '',
            createdAt: new Date(),
        },
    });

    const onSubmit = (data: NewPatientFormValues) => {
        if (language !== "english") {
            const inputLanguage = data.language; // User's selection in their language
            const inputCountry = data.country;
            const mappedLanguageKey = mapLanguageToEnglish(inputLanguage, language);
            const mappedCountryKey = mapCountryToEnglish(inputCountry, language);
    
            if (mappedLanguageKey) {
                data.language = Languages[mappedLanguageKey];
            }

            if (mappedCountryKey) {
                data.country = Countries[mappedCountryKey];
            }
        }
        handleSubmit(data);
    };

    const fieldLabels = {
        firstName: {
            english: "First Name",
            arabic: "الاسم الأول",
            farsi: "نام:",
            pashto: "لومړی نوم:"
        },
        lastName: {
            english: "Last Name",
            arabic: "العائلة اسم",
            farsi: "نام خانوادگی:",
            pashto: "تخلص:"
        },
        age: {
            english: "Age",
            arabic: "العمر",
            farsi: "سن:",
            pashto: "عمر:"
        },
        phone: {
            english: "Phone Number",
            arabic: "رقم الهاتف",
            farsi: "شماره تلفن:",
            pashto: "د تلیفون شمیره:"
        },
        country: {
            english: { label: "Country", options: CountriesList },
            arabic: { label: "بلد", options: CountriesListArabic },
            farsi: { label: "کشور:", options: CountriesListFarsi },
            pashto: { label: "هیواد:", options: CountriesListPashto }
        },
        city: {
            english: "City",
            arabic: "مدينة",
            farsi: "شهر:",
            pashto: "ښار:"
        },
        language: {
            english: { label: "Language", options: LanguagesList },
            arabic: { label: "اللغة", options: LanguagesListArabic },
            farsi: { label: "زبان:", options: LanguagesListFarsi },
            pashto: { label: "ژبه:", options: LanguagesListPashto }
        },
        chiefComplaint: {
            english: "Chief Complaint",
            arabic: "طبية الشكوى",
            farsi: "شکایت پزشکی:",
            pashto: "طبي شکایت:"
        },
        submitting: {
            english: ["Submit New Patient", "Submitting..."],
            arabic: ["إرسال مريض جديد", "تقديم"],
            farsi: ["ارائه بیمار جدید", "ارائه"],
            pashto: ["نوی ناروغ وسپاري", "سپارل"]
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <TextFormField fieldName="firstName" fieldLabel={fieldLabels.firstName[language]} />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TextFormField fieldName="lastName" fieldLabel={fieldLabels.lastName[language]} />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/4">
                        <NumericalFormField form={form} fieldName="age" fieldLabel={fieldLabels.age[language]} />
                    </div>
                    <div className="w-full md:w-3/8">
                        <Controller
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <div>
                                    <label>{fieldLabels.phone[language]}</label>
                                    <div style={{ display: "flex" }}>
                                        <select
                                            onChange={(e) => field.onChange({
                                                ...field.value,
                                                countryCode: e.target.value
                                            })}
                                            value={field.value?.countryCode || "+1"}
                                        >
                                            <option value="+20">+20</option>
                                            <option value="+93">+93</option>
                                            <option value="+961">+961</option>
                                            <option value="+963">+963</option>
                                            <option value="+967">+967</option>
                                            <option value="+970">+970</option>
                                        </select>
                                        <input
                                            type="text"
                                            onChange={(e) => field.onChange({
                                                ...field.value,
                                                phoneNumber: e.target.value
                                            })}
                                            value={field.value?.phoneNumber || ""}
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                    <div className="w-full md:w-3/8">
                        <SelectFormField form={form} fieldName="language" fieldLabel={fieldLabels.language[language].label} selectOptions={fieldLabels.language[language].options} />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <SelectFormField form={form} fieldName="country" fieldLabel={fieldLabels.country[language].label} selectOptions={fieldLabels.country[language].options} />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TextFormField fieldName="city" fieldLabel={fieldLabels.city[language]} />
                    </div>
                </div>

                <TextAreaFormField form={form} fieldName="chiefComplaint" fieldLabel={fieldLabels.chiefComplaint[language]} />
                
                <div className="flex justify-center">
                    <Button type="submit" disabled={submitting} style={{ backgroundColor: !session ? 'rgb(71, 140, 143)' : '' }}>
                        <SendHorizonal className="mr-2 h-4 w-4" />
                        {submitting ? fieldLabels.submitting[language][1] : fieldLabels.submitting[language][0]}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}

export default NewPatientForm;
