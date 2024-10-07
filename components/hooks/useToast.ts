// components/hooks/useToast.ts
import { useState } from 'react';

export type ToastVariant = 'default' | 'destructive' | 'success' | 'error';

export interface Toast {
    title: string;
    description: string;
    variant: ToastVariant;
}

export function useToast() {
    const [toast, setToast] = useState<Toast | null>(null);

    return {
        toast,
        setToast: (newToast: Toast | null) => setToast(newToast),
    };
}

export default useToast;