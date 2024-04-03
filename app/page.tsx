"use client"

import * as React from 'react';

import { PatientDashboard } from '@/components/PatientDashboard';
import { Session } from "next-auth"
import { useSession, getProviders, signIn } from "next-auth/react";
import { UserSetup } from '@/components/UserSetup';
import PatientTriage from '@/app/patient/triage/page';
import { HomePage } from '@/components/HomePage';

interface ExtendedSession extends Session {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    accountType?: string | null
    specialties?: string[] | null
    id?: string | null
  }
}

const Home = () => {

  let session = useSession().data as ExtendedSession;
  const [providers, setProviders] = React.useState(null);
  const [accountType, setAccountType] = React.useState<string>("Unspecified");

  React.useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res as any);
    })();
  }, []);


  function hasUserLoggedIn() {
    return session?.user ? true : false;
  }

  function getUserType() {
    if (!hasUserLoggedIn()) return null;


    if (session.user!.accountType === 'Doctor') {
      return 'Doctor';
    }

    if (session.user!.accountType === 'Triage') {
      return 'Triage';
    }

    return 'Unspecified';
  }

  function accountTypeSetter(accountType: string) {
    session.user!.accountType = accountType;
    if (accountType === 'Triage') {
      session.user!.specialties = [];
    }
    setAccountType(accountType);
  }

  return (
    <>

      <div className={'w-full'}>

        {!hasUserLoggedIn() ? (
          providers && Object.values(providers).map((provider) => (
            <HomePage key={(provider as any).name} provider={provider} />
          ))
        ) : getUserType() === 'Unspecified' ? (
          <UserSetup accountType={accountType} setAccountType={accountTypeSetter} />
        ) : getUserType() === 'Doctor' ? (
          <PatientDashboard />
        ) : getUserType() === 'Triage' ? (
          <PatientTriage />
        ) : (
          <div>
            <p>Something went wrong. Please try again later.</p>
          </div>
        )}
      </div>
    </>
  )
};

export default Home;
