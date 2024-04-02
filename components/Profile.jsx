import { CLINICS } from "@/data/data";
import PatientCard from "./PatientCard";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const Profile = ({ name, desc, data }) => {


  let session = useSession().data;
  const [user, setUser] = useState('');

  useEffect(() => {
    setUser(session?.user);
  }, [session?.user]);

  async function getUserInfo() {
    const response = await fetch(`/api/user/${session?.user?.id}`, {
        method: "GET",
    });
    const data = response.json();
    alert(`user data ${JSON.stringify(data, null, 2)}`);
}

  return (
    <section className='w-full'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>{name} Dashboard</span>
      </h1>
      <p className='desc text-left'>{desc}</p>

      <div className='mt-10 space-y-6 py-8 sm:columns-2 sm:gap-6 xl:columns-2'>
        <div className='col-span-1'>
          {CLINICS.filter((clinic) => user?.specialties ? clinic === user?.specialties[0] : 'Cardiology').map((clinic) => (
            <PatientCard
              key={clinic}
              patient={{ name: clinic, complaint: user?.specialties ? user?.specialties[0] : 'Cardiology' }}
            />
          ))}
        </div>
        <div className='col-span-1'>
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

export default Profile;
