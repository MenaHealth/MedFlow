// components/hooks/useToast.ts
import React, { createContext, useContext, useState, useCallback } from 'react';
import * as ToastPrimitives from "@radix-ui/react-toast"
import { X } from "lucide-react"
import { cn } from "@/utils/classNames"

export type ToastProps = {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success' | 'error';
};

type ToastContextType = {
    toast: ToastProps | null;
    setToast: (toast: ToastProps | null) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);

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
                        "fixed bottom-4 right-4 z-[9999] flex items-center justify-between space-x-4 rounded-lg border p-6 shadow-2xl transition-transform",
                        toast.variant === 'destructive' &&
                        "bg-darkBlue text-white shadow-lg border-t-4 border-l-8 border-t-orange-600 border-l-orange-700 rounded-lg",
                        toast.variant === 'error' &&
                        "bg-orange-50 text-orange-950 border-t-4 border-l-8 border-t-orange-600 border-l-orange-700 rounded-xl shadow-md",
                        toast.variant === 'success' &&
                        "bg-orange-50 text-orange-600 border-4 border-r-orange-600 border-b-orange-700 shadow-xl rounded-md",
                        toast.variant === 'default' &&
                        "bg-orange-50 text-darkBlue border-2 border-orange-400 shadow-lg rounded-lg"
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