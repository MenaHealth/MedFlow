// components/hooks/useToast.ts
import { useContext } from 'react';
import { ToastContext } from '../ui/toast';

const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('Toast context not available');
    }
    const { toast, setToast } = context;
    return { toast, setToast };
};

export default useToast;