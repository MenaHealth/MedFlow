// components/auth/forgotPassword/EmailStep.tsx
import React from 'react';
import { useForgotPasswordContext } from './ForgotPasswordContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { FormProvider } from 'react-hook-form';

interface EmailStepProps {
    onNext: () => void;
}

const EmailStep: React.FC<EmailStepProps> = ({ onNext }) => {
    const { form, loading, setLoading, setToast, canSendVerificationCode, updateRateLimit, setStep } = useForgotPasswordContext();
    const { register, formState: { errors }, getValues } = form;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSendVerificationCode()) {
            setToast({
                title: 'Error',
                description: 'Please wait before requesting another verification code.',
                variant: 'error',
            });
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
                setToast({
                    title: 'Error',
                    description: data.message.stringify,
                    variant: 'success',
                });
                onNext(); // Move to the next step
            } else {
                setToast({
                    title: 'Error',
                    description: data.message.stringify,
                    variant: 'error',
                });
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

    return (
        <FormProvider {...form}>
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
                            </>
                        ) : (
                            'Send Verification Code'
                        )}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default EmailStep;