// components/auth/forgotPassword/VerificationStep.tsx
import React from 'react';
import { useForgotPasswordContext } from './ForgotPasswordContext';
import { TextFormField } from "@/components/ui/TextFormField";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

interface VerificationStepProps {
    onNext: () => void;
}

export function VerificationStep({ onNext }: VerificationStepProps) {
    const { form, loading, setLoading, setToast, handleVerificationStep } = useForgotPasswordContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Handling verification submission...');
        await handleVerificationStep();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <TextFormField
                    fieldName="tempCode"
                    fieldLabel="Verification Code"
                    autoComplete="off"
                    error={form.formState.errors.tempCode?.message}
                    register={form.register}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        'Verify Code'
                    )}
                </Button>
            </div>
        </form>
    );
}

export default VerificationStep;