"use client"

import * as React from 'react';
import { Session } from "next-auth"
import { useSession, getProviders, signIn } from "next-auth/react";
import { HomePage } from '@/components/HomePage';

interface ExtendedSession extends Session {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    accountType?: string | null
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


    if (session.user!.accountType === 'Surgeon') {
      return 'Surgeon';
    }

    return 'Unspecified';
  }

  function accountTypeSetter(accountType: string) {
    session.user!.accountType = accountType;
    setAccountType(accountType);
  }

  // if the user is logged in, redirect to /patient/dashboard
  if (hasUserLoggedIn()) {
    // redirect immediately
    window.location.href = '/patient/dashboard';
  } else {
    // window.location.href = '/';
  }

  return (
    <>

      <div className={'w-full'}>

        {!hasUserLoggedIn() && (
          providers && Object.values(providers).map((provider) => (
            <HomePage key={(provider as any).name} provider={provider} />
          ))
        )}
      </div>
    </>
  )
};

export default Home;
