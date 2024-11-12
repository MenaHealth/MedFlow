// app/layout.jsx

'use client';

import "@/styles/globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Providers } from "@/components/Providers";
import { ToastContext, useToastState, ToastComponent } from '@/components/hooks/useToast';

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const toastState = useToastState();

    return (
        <html lang="en" className="h-full w-full">
        <body className="h-full w-full flex flex-col">
        <Providers>
            <ToastContext.Provider value={toastState}>
                <div className="relative w-full">
                    <div className="gradient absolute inset-0" />
                </div>
                <LayoutWrapper>
                    {children}
                </LayoutWrapper>
                <ToastComponent />
            </ToastContext.Provider>
        </Providers>
        </body>
        </html>
    );
}