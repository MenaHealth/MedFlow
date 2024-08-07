// app/create-patient/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import NewPatient from "@/components/form/NewPatient"; // Update the import to use NewPatient

const CreatePatient = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setIsSubmitting] = useState(false);

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
        router.push("/patient-info/dashboard");
      } else {
        console.error("Failed to create patient:", response.statusText);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">New Patient Form</h1>
        <div className="border border-gray-300 p-8 bg-white shadow rounded-lg">
          <NewPatient handleSubmit={createPatient} submitting={submitting} />
        </div>
      </div>
  );
};

export default CreatePatient;