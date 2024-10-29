// components/hooks/useForgotPassword.ts
import { ForgotPasswordFormValues } from "../auth/forgotPassword/forgotPasswordSchema";

export function useForgotPassword() {
    const sendVerificationCode = async (email: string) => {
        const response = await fetch('/api/auth/forgot-password/send-verification-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
            throw new Error('Failed to send verification code.');
        }
        return response.json();
    };

    const verifyCode = async (email: string, tempCode: string) => {
        const response = await fetch('/api/auth/forgot-password/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, tempCode }),
        });
        if (!response.ok) {
            throw new Error('Invalid or expired code.');
        }
        return response.json();
    };

    const fetchSecurityQuestion = async (email: string) => {
        const response = await fetch(`/api/auth/forgot-password/get-security-questions?email=${email}`);
        if (!response.ok) {
            throw new Error('Failed to retrieve security question.');
        }
        return response.json();
    };

    const validateSecurityAnswer = async (data: ForgotPasswordFormValues) => {
        const response = await fetch('/api/auth/forgot-password/answer-security-question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Incorrect security answer.');
        }
        return response.json();
    };

    const resetPassword = async (email: string, newPassword: string) => {
        const response = await fetch('/api/auth/forgot-password/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword }),
        });
        if (!response.ok) {
            throw new Error('Failed to reset password.');
        }
        return response.json();
    };

    return {
        sendVerificationCode,
        verifyCode,
        fetchSecurityQuestion,
        validateSecurityAnswer,
        resetPassword,
    };
}