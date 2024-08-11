// app/create-patient/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BounceLoader } from "react-spinners";
import NewPatient from "@/components/form/NewPatient"; // Update the import to use NewPatient
import ConfirmationModal from "@/components/ConfirmationModal"; // Assume you have a confirmation modal component

const CreatePatient = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState({ firstName: "", lastName: "" });

  const createPatient = async (formData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/patient/new", {
        method: "POST",
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          patientId: formData.patientId,
          age: formData.age,
          phoneNumber: formData.phoneNumber,
          location: formData.location,
          chiefComplaint: formData.chiefComplaint,
          coordinatorId: session?.user?.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatientId(data._id); // Assuming the response includes the patient ID
        setPatientName({ firstName: formData.firstName, lastName: formData.lastName });
        setShowModal(true);
      } else {
        console.error("Failed to create patient:", response.statusText);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.push("/patient-info/dashboard"); // Navigate after modal is closed
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
      </div>
  );
};

export default CreatePatient;