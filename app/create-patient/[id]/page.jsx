// app/create-patient/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";
import NewPatientForm from "@/components/form/NewPatientForm";
import ConfirmationModal from "@/components/ConfirmationModal";
import ErrorModal from "@/components/ErrorModal";

const CreatePatient = ({ params }) => {
  const router = useRouter();
  const { id } = params;

  const [submitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`/api/patient/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPatientData(data);
        } else {
          throw new Error("Failed to fetch patient data");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError("Error fetching patient data");
        setShowErrorModal(true);
      }
    };

    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const updatePatient = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/patient/${id}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatientData({ firstName: formData.firstName, lastName: formData.lastName });
        setShowModal(true);
      } else {
        const errorMessage = await response.text();
        setError(`Failed to update patient: ${errorMessage}`);
        console.error("Failed to update patient:", errorMessage);
        setShowErrorModal(true);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
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

  const goToHome = () => {
    router.push("/");
  };

  return (
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">New Patient Form</h1>
        <div className="border border-gray-300 p-8 bg-white shadow rounded-lg">
          {submitting ? (
              <div className="flex justify-center">
                <BarLoader color="#FF5722" />
              </div>
          ) : patientData ? (
              <NewPatientForm
                  handleSubmit={updatePatient}
                  submitting={submitting}
                  email={patientData.email}
                  password={patientData.password}
                  firstName={patientData.firstName}
                  lastName={patientData.lastName}
              />
          ) : (
              <p>Loading patient data...</p>
          )}
        </div>
        {showModal && (
            <ConfirmationModal
                patientId={id}
                patientName={{ firstName: patientData?.firstName, lastName: patientData?.lastName }}
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