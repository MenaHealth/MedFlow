// app/layout.jsx

'use client';

import "@/styles/globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Providers } from "@/components/Providers";

// export const metadata = {
//     title: "MedFlow",
//     description: "Connecting patients with volunteers.",
// };

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="h-full w-full">
        <body className="h-full w-full flex flex-col">
        <Providers>
            <div className="relative w-full">
                <div className="gradient absolute inset-0" />
            </div>
            <LayoutWrapper>
                {children}
            </LayoutWrapper>
        </Providers>
        </body>
        </html>
    );
}