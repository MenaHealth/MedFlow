// components/form/NewPatientFormTelegramView.tsx

"use client";

import { FormProvider } from "react-hook-form";
import { TextFormField } from "@/components/ui/TextFormField"; // Your updated TextFormField
import { SelectFormField } from "./SelectFormField";
import { PhoneFormField } from "@/components/form/PhoneFormField";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { useNewPatientFormTelegramViewModel, NewPatientFormTelegramValues } from "./NewPatientFormTelegramViewModel";
import { RadioGroupField } from "./RadioGroupField";
import {
    LanguagesList,
    LanguagesListArabic,
    LanguagesListFarsi,
    LanguagesListPashto,
} from "@/data/languages.enum";
import {
    CountriesList,
    CountriesListArabic,
    CountriesListFarsi,
    CountriesListPashto,
} from "@/data/countries.enum";

type NewPatientFormTelegramViewProps = {
    onSubmit: (formData: NewPatientFormTelegramValues) => Promise<void>;
    language: "english" | "arabic" | "farsi" | "pashto";
    initialData?: Partial<NewPatientFormTelegramValues>;
    patientId?: string; // Pass patientId to fetch data
};

export function NewPatientFormTelegramView({
                                               onSubmit,
                                               language,
                                               initialData,
                                               patientId,
                                           }: NewPatientFormTelegramViewProps) {
    const { form, submitting, handleSubmit, loading } = useNewPatientFormTelegramViewModel({
        initialData,
        patientId,
        onSubmit,
    });

    console.log("Form Values:", form.watch()); // Debugging logs

    if (loading) {
        return <div>Loading patient data...</div>;
    }

    const fieldLabels = {
        firstName: { english: "First Name", arabic: "الاسم الأول", farsi: "نام:", pashto: "لومړی نوم:" },
        lastName: { english: "Last Name", arabic: "العائلة اسم", farsi: "نام خانوادگی:", pashto: "تخلص:" },
        dob: { english: "Date of Birth", arabic: "العمر", farsi: "سن:", pashto: "عمر:" },
        phone: { english: "Phone Number", arabic: "رقم الهاتف", farsi: "شماره تلفن:", pashto: "د تلیفون شمیره:" },
        country: {
            english: { label: "Country", options: CountriesList },
            arabic: { label: "بلد", options: CountriesListArabic },
            farsi: { label: "کشور:", options: CountriesListFarsi },
            pashto: { label: "هیواد:", options: CountriesListPashto },
        },
        city: { english: "City", arabic: "مدينة", farsi: "شهر:", pashto: "ښار:" },
        language: {
            english: { label: "Language", options: LanguagesList },
            arabic: { label: "اللغة", options: LanguagesListArabic },
            farsi: { label: "زبان:", options: LanguagesListFarsi },
            pashto: { label: "ژبه:", options: LanguagesListPashto },
        },
        chiefComplaint: { english: "Chief Complaint", arabic: "طبية الشكوى", farsi: "شکایت پزشکی:", pashto: "طبي شکایت:" },
        genderPreference: {
            english: { label: "Doctor Gender Preference", options: ["Female", "Male", "No Preference"] },
            arabic: { label: "تفضيل جنس الطبيب", options: ["أنثى", "ذكر", "كلا"] },
            farsi: { label: "ترجیح جنسیت پزشک", options: ["زن", "مرد", "هیچ"] },
            pashto: { label: "د ډاکټر جنسیت غوره توب", options: ["ښځه", "نارینه", "هیڅ"] },
        },
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <TextFormField
                        fieldName="firstName"
                        fieldLabel={fieldLabels.firstName[language]}
                        error={form.formState.errors.firstName?.message}
                    />
                    <TextFormField
                        fieldName="lastName"
                        fieldLabel={fieldLabels.lastName[language]}
                        error={form.formState.errors.lastName?.message}
                    />
                </div>
                <PhoneFormField form={form} fieldName="phone" fieldLabel={fieldLabels.phone[language]}/>
                <div className="w-full md:w-1/4 space-y-2">
                    <label htmlFor="dob" className="text-sm font-medium">
                        {fieldLabels.dob[language]}
                    </label>
                    <input
                        type="date"
                        id="dob"
                        // name="dob" // Keep only this
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10"
                        min="1900-01-01"
                        max={new Date().toISOString().split("T")[0]} // Set today's date as the max
                        {...form.register("dob", {required: true})}
                    />
                    {form.formState.errors.dob && (
                        <p className="mt-2 text-sm text-red-600">
                            {form.formState.errors.dob.message || "Please select a valid date of birth."}
                        </p>
                    )}
                </div>
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <SelectFormField
                        selectOptions={fieldLabels.country[language].options}
                        form={form}
                        fieldName="country"
                        fieldLabel={fieldLabels.country[language].label}
                    />
                    <TextFormField
                        fieldName="city"
                        fieldLabel={fieldLabels.city[language]}
                        error={form.formState.errors.city?.message}
                    />
                </div>
                <SelectFormField
                    selectOptions={fieldLabels.language[language].options}
                    form={form}
                    fieldName="language"
                    fieldLabel={fieldLabels.language[language].label}
                />
                <TextFormField
                    fieldName="chiefComplaint"
                    fieldLabel={fieldLabels.chiefComplaint[language]}
                    multiline={true}
                    rows={4}
                    error={form.formState.errors.chiefComplaint?.message}
                />
                <div className="flex flex-col mx-2">
                    <span>{fieldLabels.genderPreference[language].label}</span>
                    <RadioGroupField
                        form={form}
                        fieldName="genderPreference"
                        radioOptions={fieldLabels.genderPreference[language].options}
                    />
                </div>
                <div className="flex justify-center">
                    <Button type="submit" disabled={submitting}>
                        <SendHorizonal className="mr-2 h-4 w-4"/>
                        {submitting ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}

