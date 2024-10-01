// components/Nav.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Nav() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [toggleDropdown, setToggleDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const hamburgerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                hamburgerRef.current &&
                !hamburgerRef.current.contains(event.target as Node)
            ) {
                setToggleDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef, hamburgerRef]);

    const getInitials = (firstName: string | undefined, lastName: string | undefined) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
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

            {/* Unified Navigation with Hamburger Menu */}
            <div className="flex relative z-20">
                {!session?.user && pathname !== '/create-patient' && (
                    <Link href="/create-patient" className="outline_btn">
                        New Patient
                    </Link>
                )}
                {session?.user && (
                    <div className="flex items-center">
                        {session.user.image ? (
                            <Image
                                src={session.user.image}
                                width={37}
                                height={37}
                                className="rounded-full mr-2"
                                alt="profile"
                            />
                        ) : (
                            <div className="avatar mr-2">
                                {getInitials(session.user.firstName, session.user.lastName)}
                            </div>
                        )}
                        <div
                            ref={hamburgerRef}
                            className={`hamburger ${toggleDropdown ? "active" : ""}`}
                            onClick={() => setToggleDropdown(!toggleDropdown)}
                        >
                            <span className="bar"></span>
                            <span className="bar"></span>
                            <span className="bar"></span>
                        </div>

                        {toggleDropdown && (
                            <div
                                ref={dropdownRef}
                                className="dropdown absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                            >
                                <div className="py-1">
                                    <Link
                                        href="/my-profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setToggleDropdown(false)}
                                    >
                                        My Profile
                                    </Link>
                                    {session.user.isAdmin && (
                                        <Link
                                            href="/admin"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setToggleDropdown(false)}
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setToggleDropdown(false);
                                            signOut();
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}