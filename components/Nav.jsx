"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Nav = () => {
  const { data: session } = useSession();

  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  return (
    <nav className='w-full flex justify-between items-center mb-16 pt-3'>
      <Link href='/' className='flex gap-2'>
        <Image
          src='/assets/images/logo.svg'
          alt='logo'
          width={30}
          height={30}
          className='object-contain'
        />
        <p className='logo_text'>MedFlow</p>
      </Link>
      {/* Desktop Navigation */}
      <div className='sm:flex hidden gap-5'>
        <div className='flex gap-3 md:gap-8'>
          {session?.user && (
            <>
              <Link href='/patient/dashboard' className='outline_btn'>
                Patient List
              </Link>
              <Link href='/fajr/patient' className='outline_btn'>
                New Patient
              </Link>
              <Link href='/fajr/lab' className='outline_btn'>
                New Lab Form
              </Link>
              <Link href='/patient/660b70c7083d09310b0dc4d2' className='outline_btn'>
                Chart Template
              </Link>
            </>
          )}
        </div>
        {session?.user ? (
          <>
            <button type='button' onClick={signOut} className='outline_btn'>
              Sign Out
            </button>

            <Link href='/'>
              <Image
                src={session?.user.image}
                width={37}
                height={37}
                className='rounded-full'
                alt='profile'
              />
            </Link>
          </>

        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type='button'
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id);
                  }}
                  className='black_btn'
                >
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className='sm:hidden flex relative z-20'>
        {session?.user ? (
          <div className='flex'>

            <div className={`hamburger ${toggleDropdown ? 'active' : ''}`} onClick={() => setToggleDropdown(!toggleDropdown)}>
              <span className='bar'></span>
              <span className='bar'></span>
              <span className='bar'></span>
            </div>


            {toggleDropdown && (
              <div className='dropdown'>
                {session?.user && (
                  <>
                    <button
                      type='button'
                      onClick={() => {
                        setToggleDropdown(false);
                        signOut();
                      }}
                      className='mt-5 w-full black_btn'
                    >
                      Sign Out
                    </button>
                  </>)}
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type='button'
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id);
                  }}
                  className='black_btn'
                >
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
