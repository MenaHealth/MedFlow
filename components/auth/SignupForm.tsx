// components/auth/SignupForm.tsx
import { useContext, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { Button } from "@/components/ui/button";
import { PaperPlaneIcon} from "@radix-ui/react-icons";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import useToast from "@/components/hooks/useToast";
import SecurityQuestionsForm from './SecurityQuestionsForm';
import type { SecurityQuestionsFormValues } from './SecurityQuestionsForm';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[0-9]).{8,}$/;

const signupSchema = z.object({
    email: z.string().regex(emailRegex, "Invalid email address"),
    password: z.string().regex(passwordRegex, "Password requires 7+ letters and at least one number"),
    confirmPassword: z.string(),
    name: z.string().min(1, "Last name is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;
interface Props {
    accountType: 'Doctor' | 'Triage';
}

const SignupForm = ({ accountType }: Props) => {
    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
        },
    });

    const { setToast } = useToast();
    const router = useRouter();

    const [submitting, setSubmitting] = useState(false);
    const [showSecurityQuestions, setShowSecurityQuestions] = useState(false);
    const [userData, setUserData] = useState<SignupFormValues | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    const allFieldsFilled = Object.values(form.watch()).every(value => value);

    const onError = (errors: any) => {
        console.log('Form validation errors:', errors);
        const errorMessages = [];

        if (errors.email) {
            if (errors.email.type === 'regex') {
                errorMessages.push('Please enter a valid email address.');
            } else {
                errorMessages.push('Please enter an email address.');
            }
        }

        if (errors.password) {
            if (errors.password.type === 'regex') {
                errorMessages.push('Password requires 7+ letters and at least one number.');
            } else {
                errorMessages.push('Please enter a password.');
            }
        }

        if (errors.confirmPassword) {
            errorMessages.push('Please ensure your passwords match.');
        }

        if (errors.name) {
            errorMessages.push('Please enter your last name.');
        }

        if (errorMessages.length > 0) {
            setToast({
                title: '!',
                description: errorMessages.join('\n'),
                variant: 'destructive'
            });
        } else {
            setToast({
                title: 'Form Validation Error',
                description: 'Please correct the errors in the form.',
                variant: 'destructive'
            });
        }
    };

    const onSubmit = async (data: SignupFormValues) => {
        setSubmitting(true);

        try {
            const result = await form.trigger();
            if (!result) {
                const errorMessages = [];
                if (form.formState.errors.email) {
                    if (form.formState.errors.email.type === 'regex') {
                        errorMessages.push('Please enter a valid email address.');
                    } else {
                        errorMessages.push('Please enter an email address.');
                    }
                }

                if (form.formState.errors.password) {
                    if (form.formState.errors.password.type === 'regex') {
                        errorMessages.push('Password requires 7+ letters and at least one number.');
                    } else {
                        errorMessages.push('Please enter a password.');
                    }
                }

                if (form.formState.errors.confirmPassword) {
                    errorMessages.push('Please ensure your passwords match.');
                }

                if (form.formState.errors.name) {
                    errorMessages.push('Please enter your last name.');
                }

                if (errorMessages.length > 0) {
                    setToast({
                        title: '!',
                        description: errorMessages.join('\n'),
                        variant: 'destructive'
                    });
                }
            } else {
                // If the form data is valid, store the user's data locally and show the security questions form
                setUserData(data);
                setShowSecurityQuestions(true);
            }
        } catch (error) {
            console.error('Submission error:', error);
            setToast({ title: 'Signup Error', description: 'An unexpected error occurred. Please try again.', variant: 'destructive' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSecurityQuestionsSubmit = async (securityQuestionsData: { securityQuestions: Array<{ question: string, answer: string }> }) => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    securityQuestions: securityQuestionsData.securityQuestions,
                    accountType
                }),
            });

            if (response.ok) {
                setToast({ title: `${accountType} signed up successfully`, description: `You have successfully signed up as a ${accountType}.`, variant: 'success' });
                router.push('/auth/login'); // Redirect to login page
            } else {
                const result = await response.json();
                setToast({ title: 'Signup Error', description: result.message, variant: 'destructive' });
            }
        } catch (error) {
            console.error('Submission error:', error);
            setToast({ title: 'Signup Error', description: 'An unexpected error occurred. Please try again.', variant: 'destructive' });
        }
    };

    const handleBack = () => {
        setShowSecurityQuestions(false);
    };

    return (
        <div className="w-full max-w-md">
            {showSecurityQuestions ? (
                <SecurityQuestionsForm onSubmit={handleSecurityQuestionsSubmit} onBack={handleBack} />
            ) : (
                <div>
                    <h2 className="text-lg font-bold mb-4">Sign up as a {accountType}</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
                            <TextFormField
                                form={form}
                                fieldName="email"
                                fieldLabel="Email"
                                error={form.formState.errors.email?.message}
                            />
                            <TextFormField
                                form={form}
                                fieldName="password"
                                fieldLabel="Password"
                                type="password"
                                error={form.formState.errors.password?.message}
                                tooltip="At least 1 number and 8 characters"
                                showTooltip={showTooltip}
                                onFocus={() => setShowTooltip(true)}
                                onBlur={() => setShowTooltip(false)}
                                // onChange={() => setShowTooltip(true)}
                            />
                            <TextFormField
                                form={form}
                                fieldName="confirmPassword"
                                fieldLabel="Confirm Password"
                                type="password"
                                error={form.formState.errors.confirmPassword?.message}
                            />
                            <TextFormField
                                form={form}
                                fieldName="name"
                                fieldLabel="Last Name"
                                error={form.formState.errors.name?.message}
                            />
                            <div className="flex justify-center mt-6">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className={`flex items-center justify-center w-12 h-12 rounded-full 
                    ${allFieldsFilled ? 'bg-orange hover:bg-lightOrange shadow-[0_4px_6px_var(--orange)]' : 'bg-gray hover:bg-darkGrey'}`}
                                >
                                    {submitting ? "Submitting..." : (
                                        <PaperPlaneIcon className={`h-6 w-6 ${allFieldsFilled ? 'text-[var(--orange)]' : 'text-black'}`} />
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            )}
        </div>
    );
}

export default SignupForm;