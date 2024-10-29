"use client";
// components/form/NewPatientForm.tsx
import { FormProvider, useForm } from "react-hook-form";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { NumericalFormField } from "@/components/form/NumericalFormField";
import { TextAreaFormField } from "@/components/ui/TextAreaFormField";
import { PhoneFormField } from "@/components/form/PhoneFormField";
import { Button } from "@/components/ui/button";
import { SelectFormField } from "./SelectFormField";
import { LanguagesList, Languages, LanguagesListArabic, LanguagesListFarsi, LanguagesListPashto } from "@/data/languages.enum";
import { CountriesList, Countries, CountriesListArabic, CountriesListFarsi, CountriesListPashto } from "@/data/countries.enum";
import { useSession } from "next-auth/react";
import { mapLanguageToEnglish } from "@/utils/mapLanguageToEnglish";
import { mapCountryToEnglish } from "@/utils/mapCountryToEnglish"
import {SendHorizonal} from "lucide-react";

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
                // Convert the key to the English equivalent
                data.language = Languages[mappedLanguageKey];
            }

            if (mappedCountryKey) {
                // Convert the key to the English equivalent
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
        email: {
            english: "Email",
            arabic: "عنوان البريد الإلكتروني",
            farsi: "ایمیل:",
            pashto: "بریښنالیک:"
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
            english: {
                label: "Country",
                options: CountriesList,
            },
            arabic: {
                label: "بلد",
                options: CountriesListArabic
            },
            farsi: {
                label: "کشور:",
                options: CountriesListFarsi
            },
            pashto: {
                label: "هیواد:",
                options: CountriesListPashto
            }
        },
        city: {
            english: "City",
            arabic: "مدينة",
            farsi: "شهر:",
            pashto: "ښار:"
        },
        language: {
            english: {
                label: "Language",
                options: LanguagesList,
            },
            arabic: {
                label: "اللغة",
                options: LanguagesListArabic
            },
            farsi: {
                label: "زبان:",
                options: LanguagesListFarsi
            },
            pashto: {
                label: "ژبه:",
                options: LanguagesListPashto
            }
        },
        previouslyRegistered: {
            english: {
                label: "Has the patient been registered with us before?",
                options: ["Yes", "No"],
            },
            arabic: {
                label: "هل تم تسجيل المريض لدينا من قبل؟",
                options: ["نعم", "كلا"]
            },
            farsi: {
                label: "آیا بیمار قبلاً نزد ما ثبت نام کرده است؟",
                options: ["بله", "خیر"]
            },
            pashto: {
                label: "ایا ناروغ مخکې له موږ سره راجستر شوی؟",
                options: ["هو", "نه"]
            }
        },
        genderPreference: {
            english: {
                label: "Do you have a preference on the gender of the doctor we connect you with?",
                options: ["Female", "Male", "No Preference"],
            },
            arabic: {
                label: "لديك تفضيل على جنس(أنثى / ذكر) الطبيب الذي سيتواصل معك؟ هل",
                options: ["نعم أفضل طبيبة", "نعم أفضل طبيب", "كلا ليس لدي تفضيل"]
            },
            farsi: {
                label: "آیا شما ترجیحی در مورد جنسیت دکتری که با شما ارتباط داریم دارید؟",
                options: ["بله - من فقط می خواهم به یک پزشک خانم مراجعه کنم:", "بله - من فقط می خواهم به یک پزشک مرد مراجعه کنم:", "خیر - ترجیحی ندارم:"]
            },
            pashto: {
                label: "ایا تاسو د هغه ډاکټر جنسیت ته لومړیتوب لرئ چې موږ ورسره اړیکه ونیسو؟",
                options: ["هو - زه غواړم یوازې یوه ښځینه ډاکټره وګورم", "هو - زه غواړم یوازې یو نارینه ډاکټر وګورم", "نه - زه ترجیح نه لرم"]
            }
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
            <form onSubmit={form.handleSubmit(onSubmit)} onChange={() => console.log(form.getValues())} className="space-y-8">
                {/* Top row - name */}
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <TextFormField fieldName="firstName" fieldLabel={fieldLabels.firstName[language]} />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TextFormField fieldName="lastName" fieldLabel={fieldLabels.lastName[language]} />
                    </div>
                </div>

                {/* Second row - age, phone, language */}
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/4">
                        <NumericalFormField form={form} fieldName="age" fieldLabel={fieldLabels.age[language]} />
                    </div>
                    <div className="w-full md:w-3/8">
                        <PhoneFormField form={form} fieldName="phone" fieldLabel={fieldLabels.phone[language]} />
                    </div>
                    <div className="w-full md:w-3/8">
                        <SelectFormField form={form} fieldName="language" fieldLabel={fieldLabels.language[language].label} selectOptions={fieldLabels.language[language].options}/>
                    </div>
                </div>

                {/* Third row - city, country */}
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <SelectFormField form={form} fieldName="country" fieldLabel={fieldLabels.country[language].label} selectOptions={fieldLabels.country[language].options} />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TextFormField fieldName="city" fieldLabel={fieldLabels.city[language]} />
                    </div>
                </div>

                {/* Fourth row - Chief Complaint */}
                <TextAreaFormField form={form} fieldName="chiefComplaint" fieldLabel={fieldLabels.chiefComplaint[language]} />
                
                {!session && (
                    <>
                        {/* Fifth row - Gender Preference */}
                        <div className="flex flex-col mx-2">
                            <span>{fieldLabels.genderPreference[language].label}</span>
                            <RadioGroupField
                                form={form}
                                fieldName="genderPreference"
                                radioOptions={fieldLabels.genderPreference[language].options}
                            />
                        </div>

                        {/* Sixth row - Previously Registered */}
                        <div className="flex flex-col mx-2">
                            <span>{fieldLabels.previouslyRegistered[language].label}</span>
                            <RadioGroupField
                                form={form}
                                fieldName="previouslyRegistered"
                                radioOptions={fieldLabels.previouslyRegistered[language].options}
                            />
                        </div>
                    </>
                )}
                
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