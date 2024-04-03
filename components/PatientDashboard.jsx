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

    async function getUserInfo() {
      const response = await fetch(`/api/patient?assignedDocId=${session?.user?.id}`, {
        method: "GET",
        params: { assignedDocId: session?.user?.accountType },
      });
      const data = await response.json();
      setData(data);
    }

    async function getClinicStats(clinicName) {
      try {
        const response = await fetch(`/api/patient?countClinicPatients=${clinicName}`, {
          method: "GET",
          params: { assignedDocId: session?.user?.accountType },
        });
        const data = await response.json();
        setClinicCounts((prev) => ({ ...prev, [clinicName]: data.count }));
      } catch (error) {
        console.log(error);
      }
    }

    getUserInfo();
    getClinicStats(session?.user.specialties[0]);
  }, [session?.user]);

  return (
    <section className='w-full h-screen space-y-2'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>Dashboard</span>
      </h1>

      <div className='mt-10 grid grid-cols-2 gap-6 py-8'>
        <div>
          {CLINICS.filter((clinic) => user?.specialties ? clinic === user?.specialties[0] : 'Cardiology').map((clinic) => (
            <ClinicCard
              key={clinic}
              clinic={{ name: clinic, complaint: user?.specialties ? user?.specialties[0] : 'Cardiology' }}
              count={clinicCounts[clinic]}
            />
          ))}
        </div>
        <div>
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
