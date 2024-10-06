// components/auth/forgotPassword/SecurityQuestionStep.tsx
import React from 'react';
import { useForgotPasswordContext } from './ForgotPasswordContext';
import { TextFormField } from "@/components/ui/TextFormField";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { z } from "zod";
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";

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

    const onSubmit = async (data: SecurityQuestionFormValues) => {
        if (!securityQuestion) {
            setToast?.({
                title: 'Error',
                description: 'Security question is missing. Please try again.',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);
        try {
            await handleSecurityQuestionStep(data.securityAnswer, securityQuestion);
            onNext();
        } catch (error) {
            console.error('Error during security question verification:', error);
            // Error handling is now done in handleSecurityQuestionStep
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
                <p><strong>Security Question:</strong> {securityQuestion}</p>

                <TextFormField
                    fieldName="securityAnswer"
                    fieldLabel="Security answer"
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