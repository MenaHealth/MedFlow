// components/auth/forgotPassword/SecurityQuestionStep.tsx
'use client'

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForgotPasswordContext } from './ForgotPasswordContext';
import { TextFormField } from "@/components/ui/TextFormField";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

interface SecurityQuestionStepProps {
    onNext: () => void;
}

const securityAnswerSchema = z.object({
    securityAnswer: z.string().min(1, "Please enter an answer"),
});

type SecurityQuestionFormValues = z.infer<typeof securityAnswerSchema>;

export function SecurityQuestionStep({ onNext }: SecurityQuestionStepProps) {
    const { loading, setLoading, setToast, handleSecurityQuestionStep, securityQuestion } = useForgotPasswordContext();

    const form = useForm<SecurityQuestionFormValues>({
        resolver: zodResolver(securityAnswerSchema),
        defaultValues: {
            securityAnswer: '',
        },
    });

    // components/auth/forgotPassword/SecurityQuestionStep.tsx
    const onSubmit = async (data: SecurityQuestionFormValues) => {
        if (!securityQuestion) {
            setToast?.({
                title: 'Error',
                description: 'Security question is missing. Please try again.',
                variant: 'destructive',
            });
            return;
        }

        console.log('Handling security question submission...');
        setLoading(true);
        try {
            await handleSecurityQuestionStep(data.securityAnswer, securityQuestion.question); // Pass both answer and question
            onNext();
        } catch (error) {
            console.error('Security question verification error:', error);
            setToast?.({
                title: 'Verification Error',
                description: 'Failed to verify the security answer. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!securityQuestion) {
        return <p>Loading security question...</p>;
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <p className="font-medium mb-2">Security Question: {securityQuestion.question}</p>
                <TextFormField
                    fieldName="securityAnswer"
                    fieldLabel="Security Answer"
                    autoComplete="off"
                    error={form.formState.errors.securityAnswer?.message}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        'Submit Answer'
                    )}
                </Button>
            </form>
        </FormProvider>
    );
}

export default SecurityQuestionStep;