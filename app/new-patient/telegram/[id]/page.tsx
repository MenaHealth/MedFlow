// app/new-patient/telegram/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";
import { NewPatientFormTelegramView } from "@/components/form/NewPatientFormTelegramView";
import ConfirmationModal from "@/components/ConfirmationModal";
import ErrorModal from "@/components/ErrorModal";
import { NewPatientFormTelegramValues } from "@/components/form/NewPatientFormTelegramViewModel";
import { Button } from "@/components/ui/button";

import {
    CountriesList,
    CountriesListArabic,
    CountriesListFarsi,
    CountriesListPashto,
} from "@/data/countries.enum";

type TelegramPatientFormProps = {
    params: {
        id: string;
    };
};

type PatientData = {
    firstName: string;
    lastName: string;
    hasSubmittedInfo: boolean;
    language?: "english" | "arabic" | "farsi" | "pashto"; // Add language field
};

const fieldLabels = {
    country: {
        English: { label: "Country", options: CountriesList },
        Arabic: { label: "البلد", options: CountriesListArabic },
        Farsi: { label: "کشور", options: CountriesListFarsi },
        Pashto: { label: "هیواد", options: CountriesListPashto }
    },
    // ... other fields
};

const TelegramPatientForm = ({ params }: TelegramPatientFormProps) => {
    const router = useRouter();
    const { id } = params;

    const [submitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [patientData, setPatientData] = useState<Partial<PatientData> | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    const [language, setLanguage] = useState<"English" | "Arabic" | "Farsi" | "Pashto">("English");
    const [formDataState, setFormDataState] = useState(undefined);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await fetch(`/api/patient/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPatientData(data.patient);

                    // Update language based on patient data
                    if (data.patient.language) {
                        setLanguage(data.patient.language);
                    }
                } else {
                    setError("Failed to fetch patient data");
                }
            } catch (error) {
                console.error("Error fetching patient data:", error);
                setError("An unexpected error occurred while fetching patient data");
            }
        };

        fetchPatientData();
    }, [id]);

    const createOrUpdatePatient = async (formData: NewPatientFormTelegramValues) => {
        setIsSubmitting(true);
        setError(null);
        const submittedFormData = formData ?? formDataState;

        try {
            const response = await fetch(`/api/patient/new/telegram`, {
                method: "POST",
                body: JSON.stringify({ patientId: id, ...submittedFormData, hasSubmittedInfo: false }), // Pass patientId correctly
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                setPatientData(data.patient);
                setShowModal(false);
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error("Error creating/updating patient:", error);
            setError("An unexpected error occurred. Please try again.");
            setShowErrorModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        router.replace(`/patient/${id}`);
    };

    const header = {
        English: patientData?.hasSubmittedInfo ? "Thank you for submitting" : (patientData ? "Update Patient Information" : "New Patient Form"),
        Arabic: patientData?.hasSubmittedInfo ? "شكرا لتقديمك" : (patientData ? "تحديث معلومات المريض" : "نموذج مريض جديد"),
        Farsi: patientData?.hasSubmittedInfo ? "با تشکر از ارسال شما" : (patientData ? "به روز رسانی اطلاعات بیمار" : "فرم بیمار جدید"),
        Pashto: patientData?.hasSubmittedInfo ? "د سپارلو لپاره مننه" : (patientData ? "د ناروغ معلومات تازه کول" : "د نوي ناروغ فورمه"),
    };

    const submittedMessage = {
        English: "Thanks for submitting. Please wait for our team to review your info.",
        Arabic: "شكرا على التقديم. يرجى الانتظار حتى يراجع فريقنا معلوماتك.",
        Farsi: "با تشکر از ارسال. لطفاً منتظر بمانید تا تیم ما اطلاعات شما را بررسی کند.",
        Pashto: "د سپارلو لپاره مننه. مهرباني وکړئ صبر وکړئ چې زموږ ټیم ستاسو معلومات وګوري.",
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 mt-8 text-center">{header[language]}</h1>
            <div className="flex flex-col md:flex-row md:space-x-4 justify-center mb-8">
                <Button
                    className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    style={{ backgroundColor: 'rgb(71, 140, 143)' }}
                    onClick={() => setLanguage("English")}
                >
                    English
                </Button>
                <Button
                    className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    style={{ backgroundColor: 'rgb(71, 140, 143)' }}
                    onClick={() => setLanguage("Arabic")}
                >
                    العربية
                </Button>
                <Button
                    className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    style={{ backgroundColor: 'rgb(71, 140, 143)' }}
                    onClick={() => setLanguage("Farsi")}
                >
                    فارسی
                </Button>
                <Button
                    className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    style={{ backgroundColor: 'rgb(71, 140, 143)' }}
                    onClick={() => setLanguage("Pashto")}
                >
                    پښتو
                </Button>
            </div>
            <div className="border border-gray-300 p-8 bg-white shadow rounded-lg">
                {submitting ? (
                    <div className="flex justify-center">
                        <BarLoader color="#FF5722" />
                    </div>
                ) : patientData?.hasSubmittedInfo ? (
                    <p className="text-center text-lg">{submittedMessage[language]}</p>
                ) : (
                    <NewPatientFormTelegramView
                        onSubmit={createOrUpdatePatient}
                        language={language}
                        initialData={patientData}
                        setFormDataState={setFormDataState}
                        setShowModal={setShowModal}
                    />
                )}
            </div>
            {showModal && (
                <ConfirmationModal
                    patientId={id}
                    patientName={{ firstName: patientData?.firstName || "", lastName: patientData?.lastName || "" }}
                    onClose={handleModalClose}
                    submittingFromNoSession={true}
                    setSubmittingFromNoSession={() => {}}
                    submit={createOrUpdatePatient}
                    language={language}
                />
            )}
            {showErrorModal && (
                <ErrorModal errorMessage={error} onClose={() => setShowErrorModal(false)} />
            )}
        </div>
    );
};

export default TelegramPatientForm;



