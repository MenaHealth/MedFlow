import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import useToast from '../hooks/useToast';
import { ClipLoader } from 'react-spinners';

const forgotPasswordSchema = z.object({
    email: z.string().nonempty("Email is required.").email("Please enter a valid email address."),
    securityAnswer: z.string().nonempty("Security answer is required."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
            securityAnswer: '',
        },
    });

    const { setToast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [securityQuestion, setSecurityQuestion] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
                const response = await fetch('/api/auth/forgot-password/reset', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (result.success) {
                    setToast('Password reset successfully!');
                    // Optionally redirect the user to the login page
                } else {
                    setToast('Invalid security answer');
                }
            } catch (error) {
                console.error('Error resetting password:', error);
            } finally {
                setSubmitting(false);
            }
        }
    };

    return (
        <div className="w-full max-w-md">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {step === 1 && (
                        <div>
                            <TextFormField
                                form={form}
                                fieldName="email"
                                fieldLabel="Email"
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
                                fieldName="securityAnswer"
                                fieldLabel="Security answer"
                                error={form.formState.errors.securityAnswer?.message}
                            />
                            <div className="flex justify-center mt-6">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                >
                                    {submitting ? "Submitting..." : "Reset password"}
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