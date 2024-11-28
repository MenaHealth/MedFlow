// app/new-patient/telegram/[id]/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";
import { NewPatientFormTelegram } from "@/components/form/NewPatientFormTelegram";
import ConfirmationModal from "@/components/ConfirmationModal";
import ErrorModal from "@/components/ErrorModal";

type TelegramPatientFormProps = {
    params: {
        id: string;
    };
};

type FormData = {
    firstName: string;
    lastName: string;
    phone: {
        countryCode: string;
        phoneNumber: string;
    };
    dob: string;
    country: string;
    city: string;
    language: string;
    chiefComplaint: string;
};

type PatientData = {
    firstName: string;
    lastName: string;
};

const TelegramPatientForm = ({ params }: TelegramPatientFormProps) => {
    const router = useRouter();
    const { id } = params;

    const [submitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [patientData, setPatientData] = useState<Partial<PatientData> | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);

    const updatePatient = async (formData: FormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`/api/patient/new/telegram`, {
                method: "POST",
                body: JSON.stringify({ id, ...formData }),
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                setPatientData(data.patient);
                setShowModal(true);
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error("Error updating patient:", error);
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

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 mt-8 text-center">Update Patient Information</h1>
            <div className="border border-gray-300 p-8 bg-white shadow rounded-lg">
                {submitting ? (
                    <div className="flex justify-center">
                        <BarLoader color="#FF5722" />
                    </div>
                ) : (
                    <NewPatientFormTelegram
                        handleSubmit={updatePatient}
                        submitting={submitting}
                        language="english"
                        initialData={patientData || undefined} // Transform null to undefined
                    />
                )}
            </div>
            {showModal && (
                <ConfirmationModal
                    patientId={id} // Pass patient ID
                    patientName={{ firstName: patientData?.firstName || "", lastName: patientData?.lastName || "" }}
                    onClose={handleModalClose}
                    submittingFromNoSession={false}
                    setSubmittingFromNoSession={() => {}}
                    submit={updatePatient}
                    language="english"
                />
            )}
            {showErrorModal && (
                <ErrorModal errorMessage={error} onClose={() => setShowErrorModal(false)} />
            )}
        </div>
    );
};

export default TelegramPatientForm;