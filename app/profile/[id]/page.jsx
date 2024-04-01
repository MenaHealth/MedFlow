"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// import Profile from "@/components/Profile";

const UserPatients = ({ params }) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");

  const [userPatients, setUserPatients] = useState([]);
  

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch(`/api/user/${params?.id}/patients`);
      const data = await response.json();

      setUserPatients(data);
    };

    if (params?.id) fetchPatients();
  }, [params.id]);

  return (
    // <Profile
    //   name={userName}
    //   desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s patients`}
    //   data={userPatients}
    // />
    <>  </>

    );
};

export default UserPatients;
