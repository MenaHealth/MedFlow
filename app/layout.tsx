'use client';

import "@/styles/globals.css";
import "@/styles/fonts.css";
import LayoutWrapper from "@/components/nav/LayoutWrapper";
import { Providers } from "@/components/hooks/Providers";
import { ToastContext, useToastState, ToastComponent } from '@/components/hooks/useToast';
import { createApiWrapper } from '@/utils/apiWrapper';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const toastState = useToastState();
    const api = createApiWrapper(toastState.setToast);
    console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

    return (
        <html lang="en" className="h-full w-full">
        <title>MedFlow</title>
        <body className="h-full w-full flex flex-col">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
            <Providers>
                <ToastContext.Provider value={{ ...toastState, api }}>
                    <div className="relative w-full">
                        <div className="gradient absolute inset-0" />
                    </div>
                    <LayoutWrapper>{children}</LayoutWrapper>
                    <ToastComponent />
                </ToastContext.Provider>
            </Providers>
        </GoogleOAuthProvider>
        </body>
        </html>
    );
}