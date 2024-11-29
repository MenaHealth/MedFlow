// components/form/NewPatientFormTelegramViewModel.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";

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
    createdAt: z.date(),
});

export type NewPatientFormTelegramValues = z.infer<typeof newPatientFormTelegramSchema>;

type UseNewPatientFormTelegramViewModelProps = {
    initialData?: Partial<NewPatientFormTelegramValues>;
    patientId?: string; // Add this to fetch patient data
    onSubmit: (formData: NewPatientFormTelegramValues) => Promise<void>;
};

export function useNewPatientFormTelegramViewModel({ initialData, patientId, onSubmit }: UseNewPatientFormTelegramViewModelProps) {
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
        try {
            await onSubmit(data);
        } finally {
            setSubmitting(false);
        }
    });

    return { form, submitting, handleSubmit, loading };
}