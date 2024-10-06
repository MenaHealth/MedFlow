// components/auth/forgotPassword/ResetPasswordStep.tsx
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import PasswordFormField from "@/components/ui/passwordFormField";
import { ForgotPasswordFormValues } from "./forgotPasswordSchema";
import { FormProvider } from 'react-hook-form';
import { useState } from 'react';

type ResetPasswordStepProps = {
    form: UseFormReturn<ForgotPasswordFormValues>;
    onSubmit: (data: ForgotPasswordFormValues) => void;
    submitting: boolean;
};

export function ResetPasswordStep({ form, onSubmit, submitting }: ResetPasswordStepProps) {
    const [isValid, setIsValid] = useState(false);

    const handleFormSubmit = async (data: ForgotPasswordFormValues) => {
        console.log('Reset Password button clicked');
        console.log('Data being sent to onSubmit:', data);

        // Ensure newPassword matches confirmNewPassword
        if (data.newPassword !== data.confirmNewPassword) {
            form.setError("confirmNewPassword", {
                type: "manual",
                message: "Passwords must match",
            });
            return;
        }

        await onSubmit(data);  // Await the onSubmit function
    };

    // Check if the passwords match and follow the rules
    const handleValidation = (data: ForgotPasswordFormValues) => {
        const passwordRegex = /^(?=.*[0-9]).{8,}$/;
        const passwordsMatch = data.newPassword === data.confirmNewPassword;
        const passwordValid = passwordRegex.test(data.newPassword);
        setIsValid(passwordsMatch && passwordValid);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <PasswordFormField
                    form={form}
                    fieldName="newPassword"
                    fieldLabel="New Password"
                    error={form.formState.errors.newPassword?.message}
                    onBlur={() => handleValidation(form.getValues())}
                />
                <PasswordFormField
                    form={form}
                    fieldName="confirmNewPassword"
                    fieldLabel="Confirm New Password"
                    error={form.formState.errors.confirmNewPassword?.message}
                    onBlur={() => handleValidation(form.getValues())}
                />
                <div className="flex justify-center mt-6">
                    <Button
                        type="submit"
                        disabled={submitting || !isValid}
                        onClick={() => console.log("Submit button clicked")}
                    >
                        {submitting ? "Submitting..." : "Reset Password"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}

export default ResetPasswordStep;