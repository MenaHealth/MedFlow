'use client';

import { SessionProvider } from "next-auth/react";
import { ToastContext, useToastState, ToastComponent } from "./hooks/useToast";
import { createApiWrapper } from "../utils/apiWrapper";

export function Providers({ children }: { children: React.ReactNode }) {
    const toastState = useToastState();
    const api = createApiWrapper(toastState.setToast); // Create the API wrapper with the toast setter

    return (
        <SessionProvider>
            <ToastContext.Provider value={{ ...toastState, api }}>
                {children}
                <ToastComponent />
            </ToastContext.Provider>
        </SessionProvider>
    );
}