"use client";

import { usePathname } from 'next/navigation';
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

const LayoutWrapper = ({ children }) => {
    const pathname = usePathname();

    const isFullWidth = pathname === '/patient-info/dashboard';

    return (
        <div className="flex-grow flex flex-col relative z-0"> {/* Ensure Layout has lower z-index */}
            <Nav />
            <main className={`w-full ${isFullWidth ? 'px-2' : 'max-w-6xl mx-auto'} flex-grow`}>
                {children}
            </main>
            <Footer className={`w-full ${isFullWidth ? '' : 'max-w-6xl mx-auto'}`} />
        </div>
    );
};

export default LayoutWrapper;