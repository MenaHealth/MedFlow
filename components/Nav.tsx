// components/Nav.jsx
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

export default function Nav() {
    const { data: session } = useSession()
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [navRef])

    const getInitials = (firstName: string | undefined, lastName: string | undefined) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`
    }

    return (
        <nav className="w-full py-4 px-4 md:px-6 bg-white shadow-md" ref={navRef}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/assets/images/logo.svg"
                        alt="MedFlow logo"
                        width={30}
                        height={30}
                        className="object-contain"
                    />
                    <p className="text-xl font-bold">MedFlow</p>
                </Link>

                {/* Desktop Navigation - Removed conflicting classes */}
                <div className="hidden md:flex md:items-center md:space-x-4">
                    {!session?.user && pathname !== '/create-patient' && (
                        <Link href="/create-patient" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                            New Patient
                        </Link>
                    )}
                    {session?.user && (
                        <>
                            <Link href="/my-profile" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                My Profile
                            </Link>
                            {session.user.isAdmin && (
                                <Link href="/admin" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    Admin Dashboard
                                </Link>
                            )}
                            <button
                                onClick={() => signOut()}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                Sign Out
                            </button>
                        </>
                    )}
                </div>

                {/* User Avatar and Mobile Menu Button */}
                <div className="flex items-center">
                    {session?.user && (
                        <div className="flex items-center mr-4">
                            {session.user.image ? (
                                <Image
                                    src={session.user.image}
                                    width={37}
                                    height={37}
                                    className="rounded-full"
                                    alt="profile"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                                    {getInitials(session.user.firstName, session.user.lastName)}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        // className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`mt-4 ${isMenuOpen ? 'block md:hidden' : 'hidden'}`}>
                <div className="flex flex-col space-y-2">
                    {!session?.user && pathname !== '/create-patient' && (
                        <Link href="/create-patient" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                            New Patient
                        </Link>
                    )}
                    {session?.user && (
                        <>
                            <Link href="/my-profile" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                My Profile
                            </Link>
                            {session.user.isAdmin && (
                                <Link href="/admin" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    Admin Dashboard
                                </Link>
                            )}
                            <button
                                onClick={() => signOut()}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md text-left"
                            >
                                Sign Out
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}