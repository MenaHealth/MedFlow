// components/auth/forgotPassword/ResetPasswordStep.tsx
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForgotPasswordContext } from './ForgotPasswordContext';
import PasswordFormField from "@/components/ui/passwordFormField";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

const resetPasswordSchema = z.object({
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/(?=.*[0-9])/, "Password must contain at least one number"),
    confirmNewPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords must match",
    path: ["confirmNewPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordStep() {
    const { submitting, setSubmitting, handleResetPassword, setToast } = useForgotPasswordContext();

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmNewPassword: '',
        },
        mode: 'onChange', // Validate on change for real-time feedback
    });

    const [isFormValid, setIsFormValid] = useState(false);

    // Watch for changes to the form fields
    const { watch, handleSubmit, formState } = form;
    const { isValid } = formState;
    const newPassword = watch('newPassword');
    const confirmNewPassword = watch('confirmNewPassword');

    // Update form validity whenever inputs change
    useEffect(() => {
        const passwordValid = !!(newPassword && confirmNewPassword && isValid);
        setIsFormValid(passwordValid);
    }, [newPassword, confirmNewPassword, isValid]);

    const onSubmit = async (data: ResetPasswordFormValues) => {
        setSubmitting(true);
        try {
            await handleResetPassword(data);
        } catch (error) {
            console.error('Password reset error:', error);
            setToast?.({
                title: 'Reset Password Error',
                description: 'Failed to reset the password. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <PasswordFormField
                    fieldName="newPassword"
                    fieldLabel="New Password"
                    error={formState.errors.newPassword?.message}
                />
                <PasswordFormField
                    fieldName="confirmNewPassword"
                    fieldLabel="Confirm New Password"
                    error={formState.errors.confirmNewPassword?.message}
                />
                <Button type="submit" className="w-full" disabled={submitting || !isFormValid}>
                    {submitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        </>
                    ) : (
                        'Reset Password'
                    )}
                </Button>
            </form>
        </FormProvider>
    );
}

export default ResetPasswordStep;