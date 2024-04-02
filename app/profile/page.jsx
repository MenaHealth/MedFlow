"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@/components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [myPatients, setMyPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch('/api/patient/');
      const data = await response.json();

      setMyPatients(data);
    };

    fetchPatients();
  }, []);

  return (
    <Profile
      name={session?.user.name}
      desc='Welcome to your patient dashboard'
      data={myPatients}
    />
  );
};

export default MyProfile;
