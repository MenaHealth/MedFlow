// app/create-patient/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";
import NewPatientForm from "@/components/form/NewPatientForm";
import ConfirmationModal from "@/components/ConfirmationModal";
import ErrorModal from "@/components/ErrorModal";
import { useSession } from "next-auth/react";

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

    console.log("Creating patient:", formData ? formData : formDataState);

    try {
      const response = await fetch(`/api/patient-form/new`, {
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
        }, 2000);
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

  return (
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">New Patient Form</h1>
        <div className="border border-gray-300 p-8 bg-white shadow rounded-lg">
          {submitting ? (
              <div className="flex justify-center">
                <BarLoader color="#FF5722" />
              </div>
          ) : (
              <NewPatientForm
                  handleSubmit={createPatient}
                  submitting={submitting}
              />
          )}
        </div>
        {showModal && (
            <ConfirmationModal
                patientName={{ firstName: patientData?.firstName, lastName: patientData?.lastName }}
                onClose={handleModalClose}
                submittingFromNoSession={submittingFromNoSession}
                setSubmittingFromNoSession={setSubmittingFromNoSession}
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