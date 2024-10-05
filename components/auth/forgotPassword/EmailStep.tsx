// components/auth/forgotPassword/EmailStep.tsx
import React from 'react';
import { useForgotPasswordContext } from './ForgotPasswordContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface EmailStepProps {
    onNext: () => void;
}

const EmailStep: React.FC<EmailStepProps> = ({ onNext }) => {
    const { form, loading, setLoading, setToast, canSendVerificationCode, updateRateLimit, setStep } = useForgotPasswordContext();
    const { register, formState: { errors }, getValues } = form;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSendVerificationCode()) {
            setToast({ message: 'Please wait before requesting another verification code.', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            const email = getValues('email');
            const response = await fetch('/api/auth/forgot-password/send-verification-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                updateRateLimit();
                setToast({ message: data.message, type: 'success' });
                onNext(); // Move to the next step
            } else {
                setToast({ message: data.message, type: 'error' });
            }
        } catch (error) {
            setToast({ message: 'An error occurred. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loading || !canSendVerificationCode()}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        'Send Verification Code'
                    )}
                </Button>
            </div>
        </form>
    );
};

export default EmailStep;