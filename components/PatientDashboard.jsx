import { CLINICS } from "@/data/data";
import PatientCard from "./PatientCard";
import ClinicCard from "./ClinicCard";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function PatientDashboard() {

  let session = useSession().data;
  const [user, setUser] = useState('');
  const [data, setData] = useState([]);
  const [clinicCounts, setClinicCounts] = useState({});

  useEffect(() => {
    setUser(session?.user);

    async function getPatientDashboardInfo() {
      if (!session?.user) return;
      try {
        const response = await fetch(`/api/patient`, {
          method: "POST",
          body: JSON.stringify({
            assignedDocId: session?.user?.id,
            clinics: session?.user?.specialties,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const { patientData, clinicCounts } = await response.json();
        setData(patientData);
        setClinicCounts(clinicCounts);
      } catch (error) {
        console.log(error);
      }
    }

    getPatientDashboardInfo();
  }, [session?.user]);

  return (
    <section className='w-full h-screen space-y-2'>
      <h1 className='head_text text-center'>
        <span className='blue_gradient'>Dashboard</span>
      </h1>

      <div className='mt-10 grid grid-cols-2 gap-6 py-4'>
        <div className="gap-2 py-2 justify-center">
          <p className='head_text_2 py-2 text-center'>Your Clinics</p>

          {CLINICS.filter((clinic) => user?.specialties != null && user?.specialties.includes(clinic)).map((clinic) => (
            <ClinicCard
              key={clinic}
              clinic={{ name: clinic, complaint: user?.specialties ? user?.specialties[0] : 'Cardiology' }}
              count={clinicCounts[clinic]}
            />
          ))}
        </div>
        <div className="gap-2 py-2 text-center">
          <p className='head_text_2 py-2 justify-center'>Your Patients</p>
            {data.map((patient) => (
              <PatientCard
                key={patient._id}
                patient={patient}
              />
            ))}
        </div>
      </div>
    </section>
  );
};
