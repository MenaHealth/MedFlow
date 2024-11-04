// components/form/forgotPassword/ResetPasswordViewModel.tsx

import { useState, useEffect, useCallback } from 'react';
import useToast from '@/components/hooks/useToast';
import { useRouter } from 'next/navigation';

interface ResetPasswordData {
    newPassword: string;
    confirmNewPassword: string;
}

export function useResetPasswordViewModel(code: string, onSuccess?: () => void) {
    const router = useRouter();
    const { setToast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [isValidLink, setIsValidLink] = useState(false);
    const [loading, setLoading] = useState(true);

    const validateCode = useCallback(async () => {
        if (!loading) return;
        try {
            const response = await fetch(`/api/auth/forgot-password/validate-code?code=${code}`);
            if (response.ok) {
                setIsValidLink(true);
            } else {
                setIsValidLink(false);
                const errorData = await response.json();
                setToast?.({
                    title: 'Invalid Link',
                    description: errorData.message || 'The reset link is invalid or has expired.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            setIsValidLink(false);
            setToast?.({
                title: 'Error',
                description: 'An error occurred while validating the link.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [code, setToast, loading]);

    useEffect(() => {
        validateCode();
    }, [validateCode]);

    const resetPassword = async (data: ResetPasswordData) => {
        setSubmitting(true);
        try {
            const response = await fetch(`/api/auth/forgot-password/admin-pw-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, newPassword: data.newPassword }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to reset password.');
            }

            setToast?.({
                title: 'Success',
                description: 'Password reset successfully.',
                variant: 'success',
            });
            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/auth/login');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred.';
            setToast?.({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return {
        resetPassword,
        submitting,
        isValidLink,
        loading,
        validateCode,
    };
}