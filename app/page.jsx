"use client"

import * as React from 'react';
import Link from 'next/link';
import { UserOnboarding } from '@/components/form/UserOnboarding';

const Home = () => {

  return (
    <>
      <section className='w-full flex-center flex-col'>
        <h1 className='head_text text-center'>
          MedFlow
          <br className='max-md:hidden' />
          <span className='orange_gradient text-center'> Connect patients with volunteers.</span>
        </h1>
        <p className='desc text-center'>
          Connect patients with volunteers.
        </p>
      </section>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <UserOnboarding />
      </div>
    </>
  )
};

export default Home;
