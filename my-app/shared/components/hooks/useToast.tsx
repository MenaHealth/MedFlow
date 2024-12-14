// components/hooks/useToast.ts
import React, { createContext, useContext, useState, useCallback } from 'react';
import * as ToastPrimitives from "@radix-ui/react-toast"
import { X } from "lucide-react"
import { cn } from "@/utils/classNames"
import {createApiWrapper} from "@/utils/apiWrapper";

export type ToastProps = {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success' | 'error';
};

type ToastContextType = {
    toast: ToastProps | null;
    setToast: (toast: ToastProps | null) => void;
    api: ReturnType<typeof createApiWrapper>; // Add the `api` property
};

export const ToastContext = createContext<ToastContextType>({
    toast: null,
    setToast: () => {}, // Default no-op function
    api: createApiWrapper(() => {}), // Provide a default API wrapper
});

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const useToastState = () => {
    const [toast, setToastState] = useState<ToastProps | null>(null);

    const setToast = useCallback((newToast: ToastProps | null) => {
        setToastState(newToast);
        if (newToast) {
            setTimeout(() => setToastState(null), 3000);
        }
    }, []);

    return { toast, setToast };
};

export const ToastComponent: React.FC = () => {
    const { toast, setToast } = useToast();

    return (
        <ToastPrimitives.Provider>
            {toast && (
                <ToastPrimitives.Root
                    className={cn(
                        "fixed bottom-4 right-4 z-[9999] flex items-center justify-between space-x-4 rounded-lg p-6 shadow-2xl transition-transform",

                        // Shared styles for all non-destructive toasts
                        "bg-orange-50 border-2 border-t-2 border-l-2",

                        toast.variant === 'destructive' &&
                        "bg-darkBlue text-white shadow-lg rounded-lg",

                        toast.variant === 'error' &&
                        "text-orange-950 border-t-orange-950 border-l-orange-950",

                        toast.variant === 'success' &&
                        "text-orange-500 border-t-orange-500 border-l-orange-500",

                        toast.variant === 'default' &&
                        "text-darkBlue border-t-darkBlue border-l-darkBlue"
                    )}
                >
                    <div className="grid gap-1">
                        {toast.title && <ToastPrimitives.Title className="text-sm font-semibold">{toast.title}</ToastPrimitives.Title>}
                        {toast.description && <ToastPrimitives.Description className="text-sm opacity-90">{toast.description}</ToastPrimitives.Description>}
                    </div>
                    <ToastPrimitives.Close
                        className="rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
                        onClick={() => setToast(null)}
                    >
                        <X className="h-4 w-4" />
                    </ToastPrimitives.Close>
                </ToastPrimitives.Root>
            )}
            <ToastPrimitives.Viewport />
        </ToastPrimitives.Provider>
    );
};