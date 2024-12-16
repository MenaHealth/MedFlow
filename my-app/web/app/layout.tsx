'use client';

import "./../../shared/styles/globals.css";
import "./../../shared//styles/fonts.css";
import LayoutWrapper from "./../../shared/components/LayoutWrapper";
import { Providers } from "../../shared/components/Providers";
import { ToastContext, useToastState, ToastComponent } from '../../shared/components/hooks/useToast';
import { createApiWrapper } from '../../shared/utils/apiWrapper';

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const toastState = useToastState();
    const api = createApiWrapper(toastState.setToast);

    return (
        <html lang="en" className="h-full w-full">
            <title>MedFlow</title>
            <body className="h-full w-full flex flex-col">
            <Providers>
                <ToastContext.Provider value={{ ...toastState, api }}>
                    <div className="relative w-full">
                        <div className="gradient absolute inset-0" />
                    </div>
                    <LayoutWrapper>{children}</LayoutWrapper>
                    <ToastComponent />
                </ToastContext.Provider>
            </Providers>
            </body>
        </html>
    );
}