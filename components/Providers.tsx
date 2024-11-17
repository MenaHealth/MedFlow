
'use client'

import { SessionProvider } from "next-auth/react"
import { ToastContext, useToastState, ToastComponent } from "@/components/hooks/useToast"

export function Providers({ children }: { children: React.ReactNode }) {
    const toastState = useToastState();

    return (
        <SessionProvider>
            <ToastContext.Provider value={toastState}>
                {children}
                <ToastComponent />
            </ToastContext.Provider>
        </SessionProvider>
    )
}