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
    handleVerificationStep: () => Promise<void>;
    canSendVerificationCode: () => boolean;
    updateRateLimit: () => void;
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

                    // Call verify-code route
                    const verifyResponse = await fetch('/api/auth/forgot-password/verify-code', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, code }),
                    });

                    if (verifyResponse.ok) {
                        // Fetch the security question once the code is verified
                        const questionResponse = await fetch(`/api/auth/forgot-password/get-security-question?email=${email}`);
                        const questionData = await questionResponse.json();

                        if (questionResponse.ok) {
                            // Set the security question and proceed to the next step
                            setSecurityQuestion(questionData.question);
                            setStep(3); // Move to the security question step
                        } else {
                            setToast({ message: questionData.error, type: 'error' });
                        }
                    } else {
                        setToast({ message: 'Invalid verification code.', type: 'error' });
                    }
                }
            } else if (step === 3) {
                // Handle security question step
            } else if (step === 4) {
                // Handle password reset step
            }
        } catch (error) {
            setToast({ message: 'An error occurred. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationStep = async () => {
        try {
            setLoading(true);
            await form.trigger('tempCode');

            if (form.formState.isValid) {
                const email = form.getValues('email');
                const code = form.getValues('tempCode');

                // Call verify-code route
                const verifyResponse = await fetch('/api/auth/forgot-password/verify-code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, code }),
                });

                const verifyData = await verifyResponse.json();

                if (!verifyResponse.ok) {
                    setToast({ message: verifyData.error || 'Invalid verification code.', type: 'error' });
                    return;
                }

                // Fetch the security question
                const questionResponse = await fetch(`/api/auth/forgot-password/get-security-question?email=${email}`);
                const questionData = await questionResponse.json();

                if (!questionResponse.ok) {
                    setToast({ message: questionData.error || 'Failed to get security question.', type: 'error' });
                    return;
                }

                setSecurityQuestion(questionData.question);
                setStep(3); // Move to security question step
            }
        } catch (error) {
            console.error('Error during verification:', error);
            setToast({ message: 'An error occurred. Please try again.', type: 'error' });
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

    return (
        <ForgotPasswordContext.Provider
            value={{
                step,
                setStep,
                securityQuestion,
                setSecurityQuestion,
                form,
                loading,
                setLoading,
                submitting,
                setSubmitting,
                setToast,
                handleVerificationStep,
                handleNextStep,
                canSendVerificationCode,
                updateRateLimit,
            }}
        >
            {children}
        </ForgotPasswordContext.Provider>
    );
};