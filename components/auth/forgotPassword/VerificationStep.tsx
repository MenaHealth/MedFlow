// components/auth/forgotPassword/VerificationStep.tsx
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForgotPasswordContext } from './ForgotPasswordContext';
import { TextFormField } from "@/components/ui/TextFormField";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

interface VerificationStepProps {
    onNext: () => void;
}

const verificationSchema = z.object({
    tempCode: z.string().min(6, "Verification code must be at least 6 characters").max(6, "Verification code must be at most 6 characters"),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

export function VerificationStep({ onNext }: VerificationStepProps) {
    const { loading, setLoading, setToast, handleVerificationStep } = useForgotPasswordContext();

    const form = useForm<VerificationFormValues>({
        resolver: zodResolver(verificationSchema),
        defaultValues: {
            tempCode: '',
        },
    });

    const onSubmit = async (data: VerificationFormValues) => {
        console.log('Handling verification submission...', data);
        setLoading(true);
        try {
            await handleVerificationStep(data.tempCode);
            onNext();
        } catch (error) {
            console.error('Verification error:', error);
            setToast?.({
                title: 'Verification Error',
                description: 'Failed to verify the code. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <TextFormField
                    fieldName="tempCode"
                    fieldLabel="Verification Code"
                    autoComplete="off"
                    error={form.formState.errors.tempCode?.message}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        </>
                    ) : (
                        'Verify Code'
                    )}
                </Button>
            </form>
        </FormProvider>
    );
}

export default VerificationStep;