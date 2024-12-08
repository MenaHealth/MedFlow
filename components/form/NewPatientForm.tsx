"use client";
// components/form/NewPatientForm.tsx
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
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
import { RadioGroupField } from "./RadioGroupField";

const newPatientFormSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.object({
        countryCode: z.string().min(1, "Country code is required"),
        phoneNumber: z.string().min(1, "Phone number is required"),
    }),
    dob: z.string().refine(
        (date) => {
            const parsedDate = new Date(date);
            return parsedDate >= new Date("1900-01-01") && parsedDate <= new Date();
        },
        { message: "Date of birth must be between 1900 and today" }
    ),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    language: z.string().min(1, "Language is required"),
    chiefComplaint: z.string().min(1, "Please enter the main reason you seek medical care"),
    genderPreference: z.string(),
    previouslyRegistered: z.string(),
    isPatientFields: z.object({
        isPatient: z.boolean(),
        patientRelation: z.string().optional(),
    }).superRefine((data, context) => {
        if (!data.isPatient && (!data.patientRelation || data.patientRelation.trim() === "")) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Patient relation is required",
                path: ["patientRelation"],
            });
        }
    }),
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

    const [isPatient, setIsPatient] = useState(true); 

    const form = useForm<NewPatientFormValues>({
        resolver: zodResolver(newPatientFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            phone: {
                countryCode: '',
                phoneNumber: '',
            },
            dob: '',
            country: '',
            city: '',
            language: '',
            chiefComplaint: '',
            genderPreference: '',
            previouslyRegistered: '',
            isPatientFields: {
                isPatient,
                patientRelation: '',
            },
            createdAt: new Date()
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
        console.log(data);
        const newData = JSON.parse(JSON.stringify(data));
        newData.isPatient = data.isPatientFields.isPatient;
        newData.patientRelation = data.isPatientFields.patientRelation;
        delete newData.isPatientFields;
        console.log(newData);
        handleSubmit(newData);
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
        dob: {
            english: "DoB",
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
        isPatient: {
            english: 'Please check this box if you are filling out this form on behalf of the patient',
            arabic: 'يرجى تحديد هذا المربع إذا كنت تقوم بملء هذا النموذج نيابة عن المريض',
            farsi: 'اگر از طرف بیمار این فرم را پر می کنید، لطفاً این کادر را علامت بزنید',
            pashto: 'مهرباني وکړئ دا بکس چیک کړئ که تاسو د ناروغ په استازیتوب دا فورمه ډکه کړئ'
        },
        patientRelation: {
            english: 'What is your relation to the patient?',
            arabic: 'ما هي علاقتك بالمريض؟',
            farsi: 'نسبت شما با بیمار چیست؟',
            pashto: 'ستاسو د ناروغ سره څه اړیکه ده؟'
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
                        <TextFormField fieldName="firstName" fieldLabel={fieldLabels.firstName[language]} error={form.formState.errors.firstName?.message} />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TextFormField fieldName="lastName" fieldLabel={fieldLabels.lastName[language]} error={form.formState.errors.lastName?.message} />
                    </div>
                </div>

                {/* Second row - age, phone, language */}
                <div className="flex flex-col md:flex-row md:space-x-4">
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
                            {...form.register("dob", { required: true })}
                        />
                        {form.formState.errors.dob && (
                            <p className="mt-2 text-sm text-red-600">
                                {form.formState.errors.dob.message || "Please select a valid date of birth."}
                            </p>
                        )}
                    </div>
                    <div className="w-full md:w-3/8">
                        <PhoneFormField form={form} fieldName="phone" fieldLabel={fieldLabels.phone[language]} countryCodeError={form.formState.errors.phone?.countryCode?.message}/>
                    </div>
                    <div className="w-full md:w-3/8">
                        <SelectFormField
                            form={form}
                            fieldName="language"
                            fieldLabel={fieldLabels.language[language].label}
                            selectOptions={fieldLabels.language[language].options}
                        />
                    </div>
                </div>

                {/* Third row - city, country */}
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <SelectFormField form={form} fieldName="country"
                                         fieldLabel={fieldLabels.country[language].label}
                                         selectOptions={fieldLabels.country[language].options}/>
                    </div>
                    <div className="w-full md:w-1/2">
                        <TextFormField error={form.formState.errors.city?.message} fieldName="city" fieldLabel={fieldLabels.city[language]}/>
                    </div>
                </div>

                {/* Fourth row - Chief Complaint */}
                <TextAreaFormField form={form} fieldName="chiefComplaint"
                                   fieldLabel={fieldLabels.chiefComplaint[language]}
                                   error={form.formState.errors.chiefComplaint?.message}/>

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