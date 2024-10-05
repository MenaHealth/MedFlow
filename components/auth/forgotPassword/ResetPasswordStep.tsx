// components/auth/forgotPassword/ResetPasswordStep.tsx
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import PasswordFormField from "@/components/ui/passwordFormField";
import { ForgotPasswordFormValues } from "./forgotPasswordSchema";

type ResetPasswordStepProps = {
    form: UseFormReturn<ForgotPasswordFormValues>;
    onSubmit: () => void;
    submitting: boolean;
};

export function ResetPasswordStep({ form, onSubmit, submitting }: ResetPasswordStepProps) {
    return (
        <div>
            <PasswordFormField
                form={form}
                fieldName="newPassword"
                fieldLabel="New Password"
                error={form.formState.errors.newPassword?.message}
            />
            <PasswordFormField
                form={form}
                fieldName="confirmNewPassword"
                fieldLabel="Confirm New Password"
                error={form.formState.errors.confirmNewPassword?.message}
            />
            <div className="flex justify-center mt-6">
                <Button
                    type="submit"
                    disabled={submitting}
                    onClick={onSubmit}
                >
                    {submitting ? "Submitting..." : "Reset Password"}
                </Button>
            </div>
        </div>
    );
}