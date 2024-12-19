"use client";

import { usePathname } from 'next/navigation';
import Footer from "@/components/nav/Footer";
import Nav from "@/components//nav/Nav";

const LayoutWrapper = ({ children }) => {
    const pathname = usePathname();

    const isFullWidth = pathname === '/patient-info/dashboard';

    return (
        <div className="flex-grow flex flex-col">
        <main className={`z-50 w-full ${isFullWidth ? 'px-2' : 'z-50 max-w-6xl mx-auto'} flex-grow`}>
            <Nav />
            <div className="flex-grow">{children}</div>
        </main>
        <Footer className={`w-full ${isFullWidth ? '' : 'max-w-6xl mx-auto'}`} />
        </div>
    );
};

export default LayoutWrapper;