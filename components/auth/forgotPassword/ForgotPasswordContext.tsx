// components/auth/forgotPassword/ForgotPasswordContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotPasswordFormValues, forgotPasswordSchema } from './forgotPasswordSchema';
import useToast, { Toast } from '../../hooks/useToast';

interface ForgotPasswordContextType {
    step: number;
    setStep: (step: number) => void;
    securityQuestion: string | null;
    setSecurityQuestion: (question: string | null) => void;
    form: UseFormReturn<ForgotPasswordFormValues>;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    submitting: boolean;
    setSubmitting: (submitting: boolean) => void;
    setToast: (toast: Toast | null) => void;
    handleNextStep: () => Promise<void>;
    handleVerificationStep: (tempCode: string) => Promise<void>;
    canSendVerificationCode: () => boolean;
    updateRateLimit: () => void;
    handleSecurityQuestionStep: (securityAnswer: string, securityQuestion: string) => Promise<void>;
    handleResetPassword: (data: ForgotPasswordFormValues) => Promise<void>;
}

const ForgotPasswordContext = createContext<ForgotPasswordContextType | undefined>(undefined);

export const useForgotPasswordContext = () => {
    const context = useContext(ForgotPasswordContext);
    if (!context) {
        throw new Error('useForgotPasswordContext must be used within a ForgotPasswordProvider');
    }
    return context;
};

export const ForgotPasswordProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [step, setStep] = useState(1);
    const [securityQuestion, setSecurityQuestion] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { setToast } = useToast();
    const [rateLimit, setRateLimit] = useState({ lastRequestTime: 0, requestCount: 0 });

    const form = useForm<ForgotPasswordFormValues>({
        defaultValues: {
            newPassword: '',
            confirmNewPassword: '',
        },
        resolver: zodResolver(forgotPasswordSchema),
        mode: 'onChange',
    });

    const handleNextStep = async () => {
        try {
            setLoading(true);
            if (step === 1) {
                setStep(2);
            } else if (step === 2) {
                // Verify the code entered by the user
                await form.trigger('tempCode');
                if (form.formState.isValid) {
                    const email = form.getValues('email');
                    const code = form.getValues('tempCode');

                    // Call verify-code route (this part should remain here)
                    const verifyResponse = await fetch('/api/auth/forgot-password/verify-code', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, code }),
                    });

                    if (verifyResponse.ok) {
                        // Verification successful, now proceed to the next step (security question handled elsewhere)
                        setStep(3);
                    } else {
                        setToast({
                            title: 'Error',
                            description: 'Invalid verification code.',
                            variant: 'error',
                        });
                    }
                }
            } else if (step === 3) {
                // Handle security question step (no fetching done here)
            } else if (step === 4) {
                // Handle password reset step
            }
        } catch (error) {
            setToast({
                title: 'Error',
                description: 'An error occurred. Please try again.',
                variant: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const canSendVerificationCode = () => {
        const now = Date.now();
        const timeSinceLastRequest = now - rateLimit.lastRequestTime;
        const cooldownPeriod = 60 * 1000; // 1 minute cooldown
        const maxRequests = 3; // Max 3 requests per cooldown period

        if (timeSinceLastRequest > cooldownPeriod) {
            return true;
        }

        return rateLimit.requestCount < maxRequests;
    };

    const updateRateLimit = () => {
        const now = Date.now();
        const timeSinceLastRequest = now - rateLimit.lastRequestTime;
        const cooldownPeriod = 60 * 1000; // 1 minute cooldown

        if (timeSinceLastRequest > cooldownPeriod) {
            setRateLimit({ lastRequestTime: now, requestCount: 1 });
        } else {
            setRateLimit(prev => ({
                lastRequestTime: now,
                requestCount: prev.requestCount + 1,
            }));
        }
    };

    const handleVerificationStep = async (tempCode: string) => {
        try {
            setLoading(true);
            const email = form.getValues('email');

            // Call verify-code route
            const verifyResponse = await fetch('/api/auth/forgot-password/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, tempCode }),
            });

            if (!verifyResponse.ok) {
                const errorData = await verifyResponse.json();
                throw new Error(errorData.error || 'Invalid verification code.');
            }

            // Fetch security question after the code is verified
            const questionResponse = await fetch(`/api/auth/forgot-password/get-security-questions?email=${email}`);

            if (!questionResponse.ok) {
                const errorData = await questionResponse.json();
                throw new Error(errorData.error || 'Failed to load security question.');
            }

            const questionData = await questionResponse.json();
            setSecurityQuestion(questionData.question);
            setStep(3); // Move to the security question step
        } catch (error) {
            console.error('Error during verification step:', error);
            setToast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'An error occurred. Please try again.',
                variant: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSecurityQuestionStep = async (securityAnswer: string, securityQuestion: string) => {
        try {
            setLoading(true);
            const email = form.getValues('email');

            console.log('Sending to /api/auth/forgot-password/verify-security-answer:', {
                email,
                securityAnswer,
                securityQuestion
            });

            const verifyResponse = await fetch('/api/auth/forgot-password/verify-security-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, securityAnswer, securityQuestion }),
            });

            if (!verifyResponse.ok) {
                const errorData = await verifyResponse.json();
                throw new Error(errorData.error || 'Incorrect answer to the security question.');
            }

            setStep(4); // Move to password reset step
        } catch (error) {
            console.error('Error during security question verification:', error);
            setToast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'An error occurred. Please try again.',
                variant: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (data: ForgotPasswordFormValues) => {
        try {
            setSubmitting(true);
            const email = form.getValues('email');

            console.log('Sending reset password request with:', { email, newPassword: data.newPassword });

            const response = await fetch('/api/auth/forgot-password/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, newPassword: data.newPassword }),
            });

            const result = await response.json();
            if (response.ok) {
                console.log('Password reset response:', result);
                setToast({ title: 'Success', description: 'Password reset successfully.', variant: 'success' });
                setStep(5); // Success step
            } else {
                console.error('Password reset error:', result.message);
                setToast({ title: 'Error', description: result.message || 'Failed to reset password.', variant: 'error' });
            }
        } catch (error) {
            console.error('Error during password reset:', error);
            setToast({ title: 'Error', description: 'An error occurred. Please try again.', variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };



    return (
        <ForgotPasswordContext.Provider
            value={{
                step,
                setStep,
                handleNextStep,
                form,
                loading,
                setLoading,
                submitting,
                setSubmitting,
                setToast,
                handleVerificationStep,
                canSendVerificationCode,
                updateRateLimit,
                handleSecurityQuestionStep,
                securityQuestion,
                setSecurityQuestion,
                handleResetPassword,
            }}
        >
            {children}
        </ForgotPasswordContext.Provider>
    );
};