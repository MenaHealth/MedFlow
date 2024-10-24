// components/auth/forgotPassword/ForgotPasswordContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotPasswordFormValues, forgotPasswordSchema, SecurityQuestionData } from './forgotPasswordSchema';
import useToast, { Toast } from '../../hooks/useToast';
import bcrypt from "bcryptjs";

interface ForgotPasswordContextType {
    step: number;
    setStep: (step: number) => void;
    securityQuestion: SecurityQuestionData | null; // Update type here
    setSecurityQuestion: (question: SecurityQuestionData | null) => void;
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
    const [securityQuestion, setSecurityQuestion] = useState<SecurityQuestionData | null>(null);
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
        console.log(`handleNextStep called. Current step: ${step}`);
        try {
            setLoading(true);
            if (step === 1) {
                console.log('Proceeding to step 2');
                setStep(2);
            } else if (step === 2) {
                console.log('Verifying code for step 3');
                await form.trigger('tempCode');
                if (form.formState.isValid) {
                    const email = form.getValues('email');
                    const code = form.getValues('tempCode');
                    const verifyResponse = await fetch('/api/auth/forgot-password/verify-code', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, code }),
                    });

                    if (verifyResponse.ok) {
                        console.log('Code verification successful, moving to step 3');
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
                console.log('Proceeding to step 4');
                setStep(4);
            }
        } catch (error) {
            console.error('Error in handleNextStep:', error);
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
            setSecurityQuestion({
                question: questionData.question,
                questionId: questionData.questionId
            });
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

    const handleSecurityQuestionStep = async (securityAnswer: string): Promise<void> => {
        try {
            setLoading(true);
            const email = form.getValues('email');

            if (!securityQuestion) {
                throw new Error('Security question is missing');
            }

            console.log('Sending security answer verification request...');

            const hashedAnswer = await bcrypt.hash(securityAnswer, 10);
            const response = await fetch('/api/auth/forgot-password/verify-security-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    securityAnswer,
                    securityQuestion: securityQuestion.question,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Security answer verification failed:', data);
                throw new Error(data.error || 'Failed to verify security answer');
            }

            console.log('Security answer verified successfully');
            localStorage.setItem('resetToken', data.token);
            setStep(4); // Move to password reset step
        } catch (error) {
            console.error('Error during security question verification:', error);
            throw error; // Re-throw the error to be caught in the component
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (data: ForgotPasswordFormValues) => {
        try {
            setSubmitting(true);
            const email = form.getValues('email');
            const token = localStorage.getItem('resetToken'); // Retrieve the token

            if (!email || !data.newPassword || !token) {
                console.error('Missing email, password, or token');
                setToast({
                    title: 'Error',
                    description: 'Email, new password, and a valid token are required.',
                    variant: 'error'
                });
                return;
            }

            const response = await fetch('/api/auth/forgot-password/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the token here
                },
                body: JSON.stringify({ email, newPassword: data.newPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.message === 'Password reset successfully') {
                setToast({
                    title: 'Success',
                    description: 'Password reset successfully.',
                    variant: 'success'
                });
                setStep(5); // Success step
            } else {
                throw new Error(result.message || 'Failed to reset password.');
            }
        } catch (error) {
            console.error('Error during password reset:', error);
            setToast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'An error occurred. Please try again.',
                variant: 'error'
            });
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
                handleResetPassword
            }}
        >
            {children}
        </ForgotPasswordContext.Provider>
    );
};