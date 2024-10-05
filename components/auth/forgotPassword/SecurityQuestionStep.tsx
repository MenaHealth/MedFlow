// components/auth/forgotPassword/SecurityQuestionStep.tsx
import React from 'react';
import { useForgotPasswordContext } from './ForgotPasswordContext';
import { TextFormField } from "@/components/ui/TextFormField";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

interface SecurityQuestionStepProps {
    onNext: () => void;
}

export function SecurityQuestionStep({ onNext }: SecurityQuestionStepProps) {
    const { form, loading, securityQuestion } = useForgotPasswordContext();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    if (loading) {
        return (
            <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                {securityQuestion ? (
                    <p><strong>Security Question:</strong> {securityQuestion}</p>
                ) : (
                    <p>Loading security question...</p>
                )}

                <TextFormField
                    fieldName="securityAnswer"
                    fieldLabel="Security answer"
                    error={form.formState.errors.securityAnswer?.message}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Answer'
                    )}
                </Button>
            </div>
        </form>
    );
}