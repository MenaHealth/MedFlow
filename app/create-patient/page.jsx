"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import PatientForm from '@/components/form/PatientForm';
import { CLINICS } from '@/data/data';

const CreatePatient = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setIsSubmitting] = useState(false);
  const [patient, setPatient] = useState({
    name: 'Patient ' + Math.floor(Math.random() * 100),
    complaint: 'Fever',
    status: 'New',
    assignedClinic: CLINICS[Math.floor(Math.random() * 100) % CLINICS.length],
    contactNo: '1234567890',
    location: 'Gaza',
    admittedDate: new Date().toISOString().substr(0, 10),
  });

  const createPatient = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/patient/new', {
        method: 'POST',
        body: JSON.stringify({
          name: patient.name,
          birthDate: patient.birthDate,
          location: patient.location,
          govtId: patient.govtId,
          complaint: patient.complaint,
          contactNo: patient.contactNo,

          status: patient.status,
          coordinatorId: session?.user?.id,
          assignedClinic: patient.assignedClinic,
          admittedDate: patient.admittedDate,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/patient/triage');
      }
    } catch (error) {
      console.log(`error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <PatientForm
      type="Create"
      patient={patient}
      setPatient={setPatient}
      submitting={submitting}
      handleSubmit={createPatient}
    />
    </>
  );
};

export default CreatePatient;
