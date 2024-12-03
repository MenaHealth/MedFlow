// components/form/NewPatientFormTelegramView.tsx

"use client";

import { FormProvider } from "react-hook-form";
import { useState } from "react";
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
    language: "English" | "Arabic" | "Farsi" | "Pashto";
    initialData?: Partial<NewPatientFormTelegramValues>;
    patientId?: string; // Pass patientId to fetch data
    setFormDataState: (data: any) => void;
    setShowModal: (show: boolean) => void;
};

export function NewPatientFormTelegramView({
        onSubmit,
        language,
        initialData,
        patientId,
        setFormDataState,
        setShowModal
    }: NewPatientFormTelegramViewProps) {
        
    const { form, submitting, handleSubmit, loading } = useNewPatientFormTelegramViewModel({
        initialData,
        patientId,
        onSubmit,
        formLanguage: language,
        setFormDataState,
        setShowModal
    });

    const [isPatient, setIsPatient] = useState(true); 

    console.log("Form Values:", form.watch()); // Debugging logs

    if (loading) {
        return <div>Loading patient data...</div>;
    }

    
    const fieldLabels = {
        firstName: { English: "First Name", Arabic: "الاسم الأول", Farsi: "نام:", Pashto: "لومړی نوم:" },
        lastName: { English: "Last Name", Arabic: "العائلة اسم", Farsi: "نام خانوادگی:", Pashto: "تخلص:" },
        dob: { English: "Date of Birth", Arabic: "العمر", Farsi: "سن:", Pashto: "عمر:" },
        phone: { English: "Phone Number", Arabic: "رقم الهاتف", Farsi: "شماره تلفن:", Pashto: "د تلیفون شمیره:" },
        country: {
            English: { label: "Country", options: CountriesList },
            Arabic: { label: "بلد", options: CountriesListArabic },
            Farsi: { label: "کشور:", options: CountriesListFarsi },
            Pashto: { label: "هیواد:", options: CountriesListPashto },
        },
        city: { English: "City", Arabic: "مدينة", Farsi: "شهر:", Pashto: "ښار:" },
        language: {
            English: { label: "Language", options: LanguagesList },
            Arabic: { label: "اللغة", options: LanguagesListArabic },
            Farsi: { label: "زبان:", options: LanguagesListFarsi },
            Pashto: { label: "ژبه:", options: LanguagesListPashto },
        },
        chiefComplaint: { English: "Chief Complaint", Arabic: "طبية الشكوى", Farsi: "شکایت پزشکی:", Pashto: "طبي شکایت:" },
        genderPreference: {
            English: { label: "Doctor Gender Preference", options: ["Female", "Male", "No Preference"] },
            Arabic: { label: "تفضيل جنس الطبيب", options: ["أنثى", "ذكر", "كلا"] },
            Farsi: { label: "ترجیح جنسیت پزشک", options: ["زن", "مرد", "هیچ"] },
            Pashto: { label: "د ډاکټر جنسیت غوره توب", options: ["ښځه", "نارینه", "هیڅ"] },
        },
        isPatient: {
            English: 'Please check this box if you are filling out this form on behalf of the patient',
            Arabic: 'يرجى تحديد هذا المربع إذا كنت تقوم بملء هذا النموذج نيابة عن المريض',
            Farsi: 'اگر از طرف بیمار این فرم را پر می کنید، لطفاً این کادر را علامت بزنید',
            Pashto: 'مهرباني وکړئ دا بکس چیک کړئ که تاسو د ناروغ په استازیتوب دا فورمه ډکه کړئ'
        },
        patientRelation: {
            English: 'What is your relation to the patient?',
            Arabic: 'ما هي علاقتك بالمريض؟',
            Farsi: 'نسبت شما با بیمار چیست؟',
            Pashto: 'ستاسو د ناروغ سره څه اړیکه ده؟'
        },
        submitting: {
            English: ["Submit New Patient", "Submitting..."],
            Arabic: ["إرسال مريض جديد", "تقديم"],
            Farsi: ["ارائه بیمار جدید", "ارائه"],
            Pashto: ["نوی ناروغ وسپاري", "سپارل"]
        }
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
                {/* Seventh row - Is Patient or Filling on behalf */}
                <div className="flex mx-2">
                    <>
                        <input type="checkbox" onChange={() => {form.setValue("isPatientFields.isPatient", !isPatient); setIsPatient(!isPatient);}}/>
                        <span className='mx-2'>{fieldLabels.isPatient[language]}</span>
                    </>
                </div>
                    
                {/* Eighth row - Patient Relation */}
                {
                    !isPatient && (
                        <>
                            <TextFormField fieldName="isPatientFields.patientRelation" fieldLabel={fieldLabels.patientRelation[language]} error={form.formState.errors.isPatientFields?.patientRelation?.message}/>
                        </>
                    )
                }
                <div className="flex justify-center">
                    <Button type="submit" disabled={submitting} style={{ backgroundColor: 'rgb(71, 140, 143)' }}>
                        <SendHorizonal className="mr-2 h-4 w-4"/>
                        {submitting ? fieldLabels.submitting[language][1] : fieldLabels.submitting[language][0]}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}


