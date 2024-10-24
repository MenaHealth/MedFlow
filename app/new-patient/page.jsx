// app/create-patient/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";
import NewPatientForm from "@/components/form/NewPatientForm";
import ConfirmationModal from "@/components/ConfirmationModal";
import ErrorModal from "@/components/ErrorModal";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const CreatePatient = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const [submitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [patientData, setPatientData] = useState(null);
    const [error, setError] = useState(null);
    const [submittingFromNoSession, setSubmittingFromNoSession] = useState(false);
    const [formDataState, setFormDataState] = useState(undefined);
    const [language, setLanguage] = useState("english");

    const createPatient = async (formData) => {
        setIsSubmitting(true);
        setError(null);
        formData && setPatientData({ firstName: formData.firstName, lastName: formData.lastName });
        
        if (!session && !submittingFromNoSession) {
        setFormDataState(formData);
        setShowModal(true);
        setSubmittingFromNoSession(true);
        return;
        }


        try {
        const response = await fetch(`/api/patient/new`, {
            method: "POST",
            body: JSON.stringify(formData ? formData : formDataState),
            headers: {
            "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            setShowModal(true);
            setTimeout(() => {
            router.replace(`/patient/${data._id}`);  // Redirect with the new patient ID
            }, 15000);
        } else {
            const errorMessage = await response.text();
            setError(`Failed to create patient: ${errorMessage}`);
            setShowErrorModal(true);
        }
        } catch (error) {
        console.error("Error creating patient:", error);
        setError(`An error occurred: ${error.message}`);
        setShowErrorModal(true);
        } finally {
        setIsSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        router.push("/patient-info/dashboard");
    };

    const handleErrorModalClose = () => {
        setShowErrorModal(false);
    };

    const header = {
        english: "New Patient Form",
        arabic: "نموذج مريض جديد",
        farsi: "فرم بیمار جدید:",
        pashto: "د نوي ناروغ فورمه:",
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 mt-8 text-center">{header[language]}</h1>
            <div className="flex flex-col md:flex-row md:space-x-4 justify-center mb-8">
                <Button
                    className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    style={{ backgroundColor: 'rgb(71, 140, 143)' }}
                    onClick={() => setLanguage("english")}
                >
                    English
                </Button>
                <Button
                    className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    style={{ backgroundColor: 'rgb(71, 140, 143)' }}
                    onClick={() => setLanguage("arabic")}
                >
                    العربية
                </Button>
                <Button
                    className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    style={{ backgroundColor: 'rgb(71, 140, 143)' }}
                    onClick={() => setLanguage("farsi")}
                >
                    فارسی
                </Button>
                <Button
                    className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    style={{ backgroundColor: 'rgb(71, 140, 143)' }}
                    onClick={() => setLanguage("pashto")}
                >
                    پښتو
                </Button>
            </div>
            <div className="border border-gray-300 p-8 bg-white shadow rounded-lg">
            {submitting ? (
                <div className="flex justify-center">
                    <BarLoader color="#FF5722" />
                </div>
            ) : (
                <NewPatientForm
                    handleSubmit={createPatient}
                    submitting={submitting}
                    language={language}
                />
            )}
            </div>
            {showModal && (
                <ConfirmationModal
                    patientName={{ firstName: patientData?.firstName, lastName: patientData?.lastName }}
                    onClose={handleModalClose}
                    submittingFromNoSession={submittingFromNoSession}
                    setSubmittingFromNoSession={setSubmittingFromNoSession}
                    language={language}
                    submit={createPatient}
                />
            )}
            {showErrorModal && (
                <ErrorModal
                    errorMessage={error}
                    onClose={handleErrorModalClose}
                />
            )}
        </div>
    );
};

export default CreatePatient;