import { signIn as nextAuthSignIn } from 'next-auth/react';
import { ToastProps } from '@/components/hooks/useToast';

export const createApiWrapper = (setToast: (toast: ToastProps) => void) => {
    const handleResponse = async (response: Response | any) => {
        if (response.ok || !response.error) {
            setToast({
                title: 'Success',
                description: 'Operation completed successfully.',
                variant: 'success',
            });
        } else {
            setToast({
                title: 'Error',
                description: `Error: ${response.status || ''} ${response.statusText || response.error}`,
                variant: 'error',
            });
        }
        return response;
    };

    const apiCall = async (url: string, options: RequestInit = {}) => {
        try {
            const response = await fetch(url, options);
            await handleResponse(response);
            if (response.ok) {
                return await response.json(); // Parse JSON for successful responses
            }
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        } catch (error) {
            setToast({
                title: 'Error',
                description: 'An unexpected error occurred while making the API call.',
                variant: 'error',
            });
            throw error;
        }
    };

    const signIn = async (provider: string, data: any) => {
        const response = await nextAuthSignIn(provider, { ...data, redirect: false });
        await handleResponse(response);
        return response;
    };

    return {
        get: (url: string) => apiCall(url),
        post: (url: string, data: any) =>
            apiCall(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            }),
        put: (url: string, data: any) =>
            apiCall(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            }),
        patch: (url: string, data: any) =>
            apiCall(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            }),
        delete: (url: string) =>
            apiCall(url, { method: 'DELETE' }),
        signIn, // Add `signIn` here
    };
};