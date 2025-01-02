"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Nav from './Nav';
import Footer from './Footer';

interface LayoutWrapperProps {
    children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
    const pathname = usePathname();
    const isFullWidth = pathname === '/patient-info/dashboard';

    return (
        <div className="flex flex-col min-h-screen">
            <Nav className={'mb-8'}/>
            <main className={`flex-grow w-full ${isFullWidth ? 'px-2' : 'max-w-6xl mx-auto'} pt-[8px]`}>
                {children}
            </main>
            <Footer className={`w-full ${isFullWidth ? '' : 'max-w-6xl mx-auto'}`} />
        </div>
    );
};

export default LayoutWrapper;


