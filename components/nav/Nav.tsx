'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { UserDrawer } from '@/components/ui/userDrawer';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface NavProps {
    className?: string;
}

const Nav: React.FC<NavProps> = ({ className }) => {
    const { data: session } = useSession();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const getInitials = (firstName: string | undefined, lastName: string | undefined) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
    };

    const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
        <Link href={href} className="px-4 py-2 text-sm font-medium text-darkBlue hover:bg-gray-100/30 rounded-md transition-colors">
            {children}
        </Link>
    );

    return (
        <nav className={`fixed w-full py-4 px-4 md:px-6 bg-white/30 backdrop-filter backdrop-blur-md shadow-md z-50 transition-all duration-300 ${className}`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    {pathname?.startsWith('/new-patient') ? (
                        <>
                            <Image
                                src="/assets/images/mena_health_logo.svg"
                                alt="Mena Health logo"
                                width={65}
                                height={65}
                                className="object-contain"
                            />
                        </>
                    ) : (
                        <>
                            <Image
                                src="/assets/images/logo.svg"
                                alt="MedFlow logo"
                                width={30}
                                height={30}
                                className="object-contain"
                            />
                            <p className="text-xl font-bold text-darkBlue">MedFlow</p>
                        </>
                    )}
                </Link>

                {!session?.user ? (
                    <>
                        <div className="hidden md:flex items-center space-x-4">
                            <NavItem href="/new-patient">New Patient</NavItem>
                            <NavItem href="/about">About</NavItem>
                            <NavItem href="/auth">Login</NavItem>
                        </div>
                        <button
                            className="md:hidden text-darkBlue"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <Menu size={24} />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="flex items-center justify-center"
                        aria-label="Open user menu"
                    >
                        {session.user.image ? (
                            <Image
                                src={session.user.image}
                                width={37}
                                height={37}
                                className="rounded-full"
                                alt="profile"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-darkBlue font-semibold">
                                {getInitials(session.user.firstName, session.user.lastName)}
                            </div>
                        )}
                    </button>
                )}
            </div>

            {/* Mobile menu */}
            {!session?.user && isMobileMenuOpen && (
                <div className="md:hidden mt-4 space-y-2 bg-white/80 backdrop-filter backdrop-blur-md p-4 rounded-md">
                    <NavItem href="/new-patient">New Patient</NavItem>
                    <NavItem href="/about">About</NavItem>
                    <NavItem href="/auth">Login</NavItem>
                </div>
            )}

            {session?.user && (
                <UserDrawer
                    isOpen={isDrawerOpen}
                    setIsOpen={setIsDrawerOpen}
                    user={session.user}
                />
            )}
        </nav>
    );
};

export default Nav;