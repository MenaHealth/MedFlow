// components/auth/ForgotPasswordForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import useToast from '../hooks/useToast';
import { ClipLoader } from 'react-spinners';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const forgotPasswordSchema = z.object({
    email: z
        .string()
        .nonempty("Email is required.")
        .regex(emailRegex, "Please enter a valid email address."),
    securityAnswer: z.string().nonempty("Security answer is required."),
    newPassword: z
        .string()
        .min(8, "Password requires 7+ letters and at least one number"),
    confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
            securityAnswer: '',
            newPassword: '',
            confirmNewPassword: ''
        },
    });

    const { setToast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [securityQuestion, setSecurityQuestion] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // Step 1: Fetch the security question for the email
    const fetchSecurityQuestion = async (email: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/auth/forgot-password/get-security-questions?email=${email}`);
            if (!response.ok) {
                const result = await response.json();
                if (response.status === 404) {
                    setToast({
                        title: 'Error',
                        description: 'User not found.',
                        variant: 'destructive'
                    });
                } else {
                    setToast({
                        title: 'Error',
                        description: result.error || 'Failed to retrieve security question.',
                        variant: 'destructive'
                    });
                }
                setSecurityQuestion(null);
                return;
            }
            const data = await response.json();
            setSecurityQuestion(data.question);
            setStep(2);  // Move to step 2 after successfully retrieving the security question
        } catch (error) {
            console.error('Error retrieving security question:', error);
            setToast({
                title: 'Error',
                description: 'An unexpected error occurred. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const validateSecurityAnswer = async (data: ForgotPasswordFormValues) => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/forgot-password/answer-security-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const result = await response.json();
                setToast({
                    title: 'Error',
                    description: result.error || 'Incorrect security answer.',
                    variant: 'destructive'
                });
                return;
            }

            const result = await response.json();
            if (result.success) {
                setStep(3);
            } else {
                setToast({
                    title: 'Error',
                    description: result.error || 'Incorrect security answer.',
                    variant: 'destructive'
                });
            }
        } catch (error) {
            console.error('Error validating security answer:', error);
            setToast({
                title: 'Error',
                description: 'Error validating security answer.',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleNextStep = async () => {
        if (step === 1) {
            const emailIsValid = await form.trigger("email");
            if (!emailIsValid) {
                setToast({
                    title: 'Error',
                    description: form.formState.errors.email?.message || 'Please enter a valid email address.',
                    variant: 'destructive'
                });
                return;
            }
            const email = form.getValues("email");
            await fetchSecurityQuestion(email);
        } else if (step === 2) {
            const securityAnswerIsValid = await form.trigger("securityAnswer");
            if (!securityAnswerIsValid) {
                setToast({
                    title: 'Error',
                    description: form.formState.errors.securityAnswer?.message || 'Please provide a security answer.',
                    variant: 'destructive'
                });
                return;
            }
            await validateSecurityAnswer(form.getValues());
        }
    };

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        if (step === 3) {
            try {
                setSubmitting(true);
                // The form.handleSubmit will automatically trigger validation
                // and call onError if there are any issues, so we don't need to do it here

                // Submit the form
                const response = await fetch('/api/auth/forgot-password/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...data,
                        newPassword: data.newPassword,
                        confirmNewPassword: data.confirmNewPassword,
                    }),
                });

                // Handle the response
                if (response.ok) {
                    setToast({
                        title: 'Success',
                        description: 'Password has been reset successfully.',
                        variant: 'success'
                    });
                    // Optionally, redirect the user to a different page
                } else {
                    const result = await response.json();
                    setToast({
                        title: 'Error',
                        description: result.message || 'Failed to reset password.',
                        variant: 'destructive'
                    });
                }
            } catch (error) {
                console.error('Error resetting password:', error);
                setToast({
                    title: 'Error',
                    description: 'An unexpected error occurred. Please try again.',
                    variant: 'destructive'
                });
            } finally {
                setSubmitting(false);
            }
        }
    };


    const onError = (errors: any) => {
        if (errors.email) {
            setToast({
                title: 'Error',
                description: errors.email.message || 'Please enter a valid email address.',
                variant: 'destructive'
            });
            return;
        }

        if (errors.securityAnswer) {
            setToast({
                title: '!',
                description: errors.securityAnswer.message || 'Security answer is required.',
                variant: 'destructive'
            });
            return;
        }

        if (errors.newPassword) {
            setToast({
                title: 'Error',
                description: errors.newPassword.message || 'Password requires 7+ letters and at least one number.',
                variant: 'destructive'
            });
            return;
        }

        if (errors.confirmNewPassword) {
            setToast({
                title: 'Error',
                description: errors.confirmNewPassword.message || 'Passwords do not match.',
                variant: 'destructive'
            });
            return;
        }
    };




    return (
        <div className="w-full max-w-md">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
                    {step === 1 && (
                        <div>
                            <TextFormField
                                form={form}
                                fieldName="email"
                                fieldLabel="Email"
                                id="email"
                                autoComplete="email"
                                error={form.formState.errors.email?.message}
                            />
                            <Button onClick={handleNextStep}>Next</Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            {loading ? (
                                <div className="flex justify-center">
                                    <ClipLoader size={35} color="#4A90E2" />
                                </div>
                            ) : (
                                <div>
                                    <p>{securityQuestion}</p>
                                    <TextFormField
                                        form={form}
                                        fieldName="securityAnswer"
                                        fieldLabel="Security answer"
                                        error={form.formState.errors.securityAnswer?.message}
                                    />
                                    <Button onClick={handleNextStep}>Next</Button>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <TextFormField
                                form={form}
                                fieldName="newPassword"
                                fieldLabel="New Password"
                                type="password"
                                error={form.formState.errors.newPassword?.message}
                                tooltip="At least 1 number and 8 characters"
                                showTooltip={showTooltip}
                                onFocus={() => setShowTooltip(true)}
                                onBlur={() => setShowTooltip(false)}
                            />
                            <TextFormField
                                form={form}
                                fieldName="confirmNewPassword"
                                fieldLabel="Confirm New Password"
                                type="password"
                                error={form.formState.errors.confirmNewPassword?.message}
                            />
                            <div className="flex justify-center mt-6">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                >
                                    {submitting ? "Submitting..." : "Reset Password"}
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </Form>
        </div>
    );
}

export default ForgotPasswordForm;