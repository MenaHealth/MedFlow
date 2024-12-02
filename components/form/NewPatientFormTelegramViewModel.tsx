// components/form/NewPatientFormTelegramViewModel.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Countries } from "@/data/countries.enum";
import { Languages } from "@/data/languages.enum";
import { mapCountryToEnglish } from "@/utils/mapCountryToEnglish";
import { mapLanguageToEnglish } from "@/utils/mapLanguageToEnglish";

const newPatientFormTelegramSchema = z.object({
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

export type NewPatientFormTelegramValues = z.infer<typeof newPatientFormTelegramSchema>;

type UseNewPatientFormTelegramViewModelProps = {
    initialData?: Partial<NewPatientFormTelegramValues>;
    patientId?: string; // Add this to fetch patient data
    formLanguage: "english" | "arabic" | "farsi" | "pashto";
    onSubmit: (formData: NewPatientFormTelegramValues) => Promise<void>;
    setFormDataState: (data: any) => void,
    setShowModal: (showModal: boolean) => void
};

export function useNewPatientFormTelegramViewModel({ initialData, patientId, formLanguage, setFormDataState, setShowModal }: UseNewPatientFormTelegramViewModelProps) {
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const form = useForm<NewPatientFormTelegramValues>({
        resolver: zodResolver(newPatientFormTelegramSchema),
        defaultValues: {
            firstName: initialData?.firstName || '',
            lastName: initialData?.lastName || '',
            phone: initialData?.phone || {
                countryCode: '',
                phoneNumber: '',
            },
            dob: initialData?.dob || '',
            country: initialData?.country || '',
            city: initialData?.city || '',
            language: initialData?.language || '',
            chiefComplaint: initialData?.chiefComplaint || '',
            genderPreference: initialData?.genderPreference || '',
            isPatientFields: {
                isPatient: true,
                patientRelation: '',
            },
            createdAt: new Date(),
        },
    });

    // Fetch patient data if patientId is provided
    useEffect(() => {
        if (!patientId) {
            setLoading(false);
            return;
        }

        async function fetchPatient() {
            try {
                const response = await fetch(`/api/patient/${patientId}`);
                const data = await response.json();

                if (data.patient) {
                    form.reset({
                        firstName: data.patient.firstName || '',
                        lastName: data.patient.lastName || '',
                        phone: data.patient.phone || { countryCode: '', phoneNumber: '' },
                        dob: data.patient.dob || '',
                        country: data.patient.country || '',
                        city: data.patient.city || '',
                        language: data.patient.language || '',
                        chiefComplaint: data.patient.chiefComplaint || '',
                        genderPreference: data.patient.genderPreference || '',
                        isPatientFields: {
                            isPatient: data.patient.isPatient || false,
                            patientRelation: data.patient.patientRelation || '',
                        },
                        createdAt: new Date(data.patient.createdAt) || new Date(),
                    });
                }
            } catch (error) {
                console.error("Failed to fetch patient data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPatient();
    }, [patientId, form]);

    const handleSubmit = form.handleSubmit(async (data) => {
        setSubmitting(true);
        if (formLanguage !== "english") {
            const inputLanguage = data.language; // User's selection in their language
            const inputCountry = data.country;
            const mappedLanguageKey = mapLanguageToEnglish(inputLanguage, formLanguage);
            const mappedCountryKey = mapCountryToEnglish(inputCountry, formLanguage);
    
            if (mappedLanguageKey) {
                // Convert the key to the English equivalent
                data.language = Languages[mappedLanguageKey];
            }

            if (mappedCountryKey) {
                // Convert the key to the English equivalent
                data.country = Countries[mappedCountryKey];
            }
        }
        const newData = JSON.parse(JSON.stringify(data));
        newData.isPatient = data.isPatientFields.isPatient;
        newData.patientRelation = data.isPatientFields.patientRelation;
        delete newData.isPatientFields;
        setFormDataState(newData);
        setShowModal(true);
        try {
            // await onSubmit(newData);
        } finally {
            setSubmitting(false);
        }
    });

    return { form, submitting, handleSubmit, loading };
}