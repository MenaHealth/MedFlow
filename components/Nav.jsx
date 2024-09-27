"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";

const Nav = () => {
    const { data: session } = useSession();
    const path = usePathname();

    const [toggleDropdown, setToggleDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const avatarRef = useRef(null);

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

    // Close dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                avatarRef.current && 
                !avatarRef.current.contains(event.target)
            ) {
                setToggleDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef, avatarRef]);

    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0)}${lastName?.charAt(0)}`;
    };

    return (
        <nav className="w-full flex justify-between items-center mb-8 pt-3 relative">
            <Link href="/" className="flex gap-2">
                <Image
                    src="/assets/images/logo.svg"
                    alt="logo"
                    width={30}
                    height={30}
                    className="object-contain"
                />
                <p className="logo_text">MedFlow</p>
            </Link>

            {/* Desktop Navigation */}
            <div className={`sm:flex ${isMobile ? "hidden" : ""} gap-5`}>
                <div className="flex gap-3 md:gap-4 relative">
                    {!session && path !== "/create-patient" && (
                        <>
                            <Link href="/create-patient" className="outline_btn">
                                New Patient
                            </Link>
                        </>
                    )}
                    {session?.user && (
                        <>
                            <div className="relative">
                                <div
                                    className="cursor-pointer"
                                    onClick={() => setToggleDropdown(!toggleDropdown)}
                                    ref={avatarRef}
                                >
                                    {session?.user.image ? (
                                        <Image
                                            src={session?.user.image}
                                            width={37}
                                            height={37}
                                            className="rounded-full"
                                            alt="profile"
                                        />
                                    ) : (
                                        <div className="avatar">
                                            {getInitials(session?.user?.firstName, session?.user?.lastName)}
                                        </div>
                                    )}
                                </div>

                                {toggleDropdown && (
                                    <div
                                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                                        ref={dropdownRef}
                                    >
                                        <ul className="py-1">
                                            <li>
                                                <Link
                                                    href="/my-profile"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    My Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        setToggleDropdown(false);
                                                        signOut();
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Sign Out
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="sm:hidden flex relative z-20">
                {!session && path !== '/create-patient' && toggleDropdown && (
                    <Link href="/fajr/patient" className="outline_btn mobile_link">
                        New Patient
                    </Link>
                )}
                {session?.user && (
                    <div className="flex">
                        <div
                            className={`hamburger ${toggleDropdown ? "active" : ""}`}
                            onClick={() => setToggleDropdown(!toggleDropdown)}
                        >
                            <span className="bar"></span>
                            <span className="bar"></span>
                            <span className="bar"></span>
                        </div>

                        {toggleDropdown && (
                            <div className="dropdown">
                                <Link href="/my-profile" className="outline_btn mobile_link">
                                    My Profile
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        signOut().then(() => {
                                            setToggleDropdown(false);
                                        })
                                    }}
                                    className="mt-5 w-full black_btn"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Nav;