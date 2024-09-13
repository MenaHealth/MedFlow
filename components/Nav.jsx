"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

const Nav = () => {
    const { data: session } = useSession();
    const [toggleDropdown, setToggleDropdown] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <nav className='w-full flex justify-between items-center mb-8 pt-3'>
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
            <div className={`sm:flex ${isMobile ? "hidden" : ""} gap-5`}>
                <div className='flex gap-3 md:gap-4'>
                    {session?.user && (
                        <>
                            <Link href='/fajr/patient' className='outline_btn'>
                                New Patient
                            </Link>
                            <Link href='/fajr/lab' className='outline_btn'>
                                New Lab Form
                            </Link>

                            <button type='button' onClick={signOut} className='outline_btn'>
                                Sign Out
                            </button>
                            <Link href='/'>
                                {session?.user.image ? (
                                    <Image
                                        src={session?.user.image}
                                        width={37}
                                        height={37}
                                        className='rounded-full'
                                        alt='profile'
                                    />
                                ) : (
                                    <div className='avatar'>
                                        {session?.user.name.indexOf(' ') > 0
                                            ? `${session?.user.name.split(' ')[0][0]}${session?.user.name.split(' ')[1][0]}`
                                            : session?.user.name[0]}
                                    </div>
                                )}
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className='sm:hidden flex relative z-20'>
                {session?.user && (
                    <div className='flex'>
                        <div
                            className={`hamburger ${toggleDropdown ? 'active' : ''}`}
                            onClick={() => setToggleDropdown(!toggleDropdown)}
                        >
                            <span className='bar'></span>
                            <span className='bar'></span>
                            <span className='bar'></span>
                        </div>

                        {toggleDropdown && (
                            <div className='dropdown'>
                                <>
                                    <Link href='/patient-info/dashboard' className='outline_btn mobile_link'>
                                        Patient List
                                    </Link>
                                    <Link href='/fajr/patient' className='outline_btn mobile_link'>
                                        New Patient
                                    </Link>
                                    <Link href='/fajr/lab' className='outline_btn mobile_link'>
                                        New Lab Form
                                    </Link>
                                    <Link href='/patient/660b70c7083d09310b0dc4d2' className='outline_btn mobile_link'>
                                        Chart Template
                                    </Link>
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
                                </>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Nav;