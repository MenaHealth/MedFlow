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
import PasswordFormField from "@/components/ui/passwordFormField";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const forgotPasswordSchema = z.object({
    email: z.string().nonempty("Email is required").email("Invalid email address"),
    tempCode: z.string().nonempty("Verification code is required").min(6, "Verification code must be 6 characters long"),
    securityAnswer: z.string().nonempty("Security answer is required."),
    newPassword: z.string().min(8, "Password must be at least 8 characters and contain at least one number"),
    confirmNewPassword: z.string().nonempty("Confirm Password is required"),
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
            tempCode: '',
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

    // Step 1: Send the verification code to the email
    const sendVerificationCode = async (email: string) => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/forgot-password/send-verification-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const result = await response.json();

            if (!response.ok) {
                setToast({
                    title: 'Error',
                    description: result.error || 'Failed to send verification code.',
                    variant: 'destructive'
                });
                return;
            }

            setToast({
                title: 'Success',
                description: 'Verification code sent to your email.',
                variant: 'success'
            });
            setStep(2); // Move to code verification step
        } catch (error) {
            console.error('Error sending verification code:', error);
            setToast({
                title: 'Error',
                description: 'An unexpected error occurred. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify the temporary code and fetch security question
    const verifyCode = async (email: string, tempCode: string) => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/forgot-password/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, tempCode }),
            });

            const result = await response.json();

            if (!response.ok) {
                setToast({
                    title: 'Error',
                    description: result.error || 'Invalid or expired code.',
                    variant: 'destructive'
                });
                return;
            }

            setToast({
                title: 'Success',
                description: 'Code verified. Proceed to the security question.',
                variant: 'success'
            });

            // Fetch the security question after code is verified
            await fetchSecurityQuestion(email);

            setStep(3); // Move to security question step
        } catch (error) {
            console.error('Error verifying code:', error);
            setToast({
                title: 'Error',
                description: 'An unexpected error occurred. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    // step 3: Fetch the security question after the code is verified
    const fetchSecurityQuestion = async (email: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/auth/forgot-password/get-security-questions?email=${email}`);
            const data = await response.json();
            if (!response.ok) {
                setToast({
                    title: 'Error',
                    description: data.error || 'Failed to retrieve security question.',
                    variant: 'destructive'
                });
                return;
            }
            setSecurityQuestion(data.question); // Set the security question in the state
        } catch (error) {
            console.error('Error fetching security question:', error);
            setToast({
                title: 'Error',
                description: 'An unexpected error occurred. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    // Step 3: validate security answer and move to step 4
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
                // If the security answer is correct, move to step 4 (password reset)
                setStep(4);
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
            // Step 1: Validate email and send verification code
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
            await sendVerificationCode(email);

        } else if (step === 2) {
            // Step 2: Validate the verification code
            const codeIsValid = await form.trigger("tempCode");
            if (!codeIsValid) {
                setToast({
                    title: 'Error',
                    description: form.formState.errors.tempCode?.message || 'Please enter a valid verification code.',
                    variant: 'destructive'
                });
                return;
            }
            const email = form.getValues("email");
            const tempCode = form.getValues("tempCode");
            await verifyCode(email, tempCode);

        } else if (step === 3) {
            // Step 3: Validate the security answer and transition to Step 4
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

        } else if (step === 4) {
            // Step 4: Proceed with password reset
            const passwordsValid = await form.trigger(["newPassword", "confirmNewPassword"]);
            if (!passwordsValid) {
                setToast({
                    title: 'Error',
                    description: form.formState.errors.newPassword?.message || form.formState.errors.confirmNewPassword?.message || 'Invalid password.',
                    variant: 'destructive',
                });
                return;
            }
            await form.handleSubmit(onSubmit)();  // Trigger the form submission
        }
    };

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        try {
            setSubmitting(true);

            // Submit the form
            const response = await fetch('/api/auth/forgot-password/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    newPassword: data.newPassword, // We only need the newPassword here, no need for confirmNewPassword
                }),
            });

            const result = await response.json();

            // Handle the response
            if (response.ok) {
                setToast({
                    title: 'Success',
                    description: 'Password has been reset successfully.',
                    variant: 'success',
                });
                console.log('Password reset successfully:', result); // Logging success for debugging

                // Optionally, redirect the user to a login page
                // router.push('/login');
            } else {
                setToast({
                    title: 'Error',
                    description: result.message || 'Failed to reset password.',
                    variant: 'destructive',
                });
                console.error('Password reset error:', result.message); // Logging error for debugging
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setToast({
                title: 'Error',
                description: 'An unexpected error occurred. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {step === 1 && (
                        <div>
                            <TextFormField
                                fieldName="email"
                                fieldLabel="Email"
                                autoComplete="email"
                                error={form.formState.errors.email?.message}
                            />
                            <Button onClick={handleNextStep}>Next</Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <TextFormField
                                fieldName="tempCode"
                                fieldLabel="Verification Code"
                                autoComplete="off"
                                error={form.formState.errors.tempCode?.message}
                            />
                            <Button onClick={handleNextStep}>Verify Code</Button>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            {loading ? (
                                <div className="flex justify-center">
                                    <ClipLoader size={35} color="#4A90E2" />
                                </div>
                            ) : (
                                <div>
                                    {/* Display the fetched security question */}
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
                                    <Button onClick={handleNextStep}>Next</Button>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 4 && (
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