// utils/apiWrapper.ts
import { ToastProps } from '@/components/hooks/useToast';
import { signIn as nextAuthSignIn, SignInResponse } from 'next-auth/react';

export const createApiWrapper = (setToast: (toast: ToastProps) => void) => {
    const handleResponse = async (response: Response | SignInResponse) => {
        const isFetchResponse = (resp: Response | SignInResponse): resp is Response =>
            (resp as Response).ok !== undefined;

        if (isFetchResponse(response)) {
            if (response.ok) {
                setToast({
                    title: '✓',
                    description: 'Success',
                    variant: 'success',
                });
            } else {
                setToast({
                    title: 'Error',
                    description: `Error: ${response.status} ${response.statusText}`,
                    variant: 'error',
                });
            }
        } else {
            if (!response.error) {
                setToast({
                    title: 'Success',
                    description: 'Login successful',
                    variant: 'success',
                });
            } else {
                let description = 'An unexpected error occurred';
                if (response.status === 404) description = 'Not found';
                else if (response.status === 403) description = 'Forbidden';
                else if (response.error) description = response.error;

                setToast({
                    title: 'Error',
                    description,
                    variant: 'error',
                });
            }
        }

        return response;
    };

    const apiCall = async (url: string, options: RequestInit = {}) => {
        try {
            const response = await fetch(url, options);
            await handleResponse(response);
            return await response.json();
        } catch (error) {
            setToast({
                title: 'Error',
                description: 'An unexpected error occurred',
                variant: 'error',
            });
            throw error;
        }
    };

    const signIn = async (provider: string, data: any) => {
        const response = await nextAuthSignIn(provider, { ...data, redirect: false });
        await handleResponse(response as SignInResponse);
        return response;
    };

    return {
        get: (url: string) => apiCall(url),
        post: (url: string, data: any) => apiCall(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }),
        put: (url: string, data: any) => apiCall(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }),
        patch: (url: string, data: any) => apiCall(url, {  // New PATCH method
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }),
        delete: (url: string) => apiCall(url, { method: 'DELETE' }),
        signIn,  // Use signIn in API wrapper
    };
};