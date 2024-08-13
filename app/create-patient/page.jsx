// app/create-patient/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BounceLoader } from "react-spinners";
import NewPatient from "@/components/form/NewPatient";
import ConfirmationModal from "@/components/ConfirmationModal";
import ErrorModal from "@/components/ErrorModal"; // Import the ErrorModal component

const CreatePatient = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState({ firstName: "", lastName: "" });
  const [error, setError] = useState(null);

  const createPatient = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/patient/new", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatientId(data._id);
        setPatientName({ firstName: formData.firstName, lastName: formData.lastName });
        setShowModal(true);
      } else {
        const errorMessage = await response.text();
        setError(`Failed to create patient: ${errorMessage}`);
        console.error("Failed to create patient:", errorMessage);
        setShowErrorModal(true); // Show the error modal
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      setError(`An error occurred: ${error.message}`);
      setShowErrorModal(true); // Show the error modal
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.push("/patient-info/dashboard"); // Navigate after modal is closed
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const goToHome = () => {
    router.push("/"); // Change this to your home route
  };

  return (
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">New Patient Form</h1>
        <div className="border border-gray-300 p-8 bg-white shadow rounded-lg">
          {submitting ? (
              <div className="flex justify-center">
                <BounceLoader color="#FF5722" />
              </div>
          ) : (
              <NewPatient handleSubmit={createPatient} submitting={submitting} />
          )}
        </div>
        {showModal && (
            <ConfirmationModal
                patientId={patientId}
                patientName={patientName}
                onClose={handleModalClose}
                onHome={goToHome}
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