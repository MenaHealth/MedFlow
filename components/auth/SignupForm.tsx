// components/auth/SignupForm.tsx
import { useEffect, useState } from 'react';
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
import { getProviders, signIn } from 'next-auth/react';

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

    const [providers, setProviders] = useState<any>(null);

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
            setProviders(res);
        };
        fetchProviders();
    }, []);

    const handleError = (error: any) => {
        console.error('Error:', error);
        setToast({ title: 'Error', description: error.message, variant: 'destructive' });
    };

    const onEmailAndPasswordSubmit = async (data: SignupFormValues) => {
        setSubmitting(true);

        try {
            const result = await form.trigger(); // Validate the form
            if (!result) {
                const errorMessages = [];
                if (form.formState.errors.email) {
                    errorMessages.push('Please enter a valid email address.');
                }

                if (form.formState.errors.password) {
                    errorMessages.push('Password requires 7+ letters and at least one number.');
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
                // If the form is valid, move to the security questions
                setUserData(data);
                setShowSecurityQuestions(true);
            }
        } catch (error) {
            handleError(error);
        } finally {
            setSubmitting(false);
        }
    };

    const sendWelcomeEmail = async () => {
        // Send welcome email
        try {
            const emailResponse = await fetch('/api/auth/email/welcome', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userData?.email }),
            });

            if (emailResponse.ok) {
                console.log('Welcome email sent successfully');
            } else {
                console.error('Error sending welcome email');
            }
        } catch (emailError) {
            handleError(emailError);
        }
    }

    const handleSecurityQuestionsSubmit = async (securityQuestionsData: { securityQuestions: Array<{ question: string, answer: string }> }) => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData, // Includes email, password, etc.
                    securityQuestions: securityQuestionsData.securityQuestions,
                    accountType,
                }),
            });

            if (response.ok) {
                setToast({
                    title: `${accountType} signed up successfully`,
                    description: `You have successfully signed up as a ${accountType}.`,
                    variant: 'success',
                });

                sendWelcomeEmail();

                // Redirect to login page after sending the email
                router.replace('/auth/login');
            } else {
                const result = await response.json();
                setToast({ title: 'Signup Error', description: result.message, variant: 'destructive' });
            }
        } catch (error) {
            handleError(error);
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
                        <form onSubmit={form.handleSubmit(onEmailAndPasswordSubmit, handleError)} className="space-y-4">
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
            {providers &&
                Object.values(providers).filter((provider: any) => provider.id !== 'credentials').map((provider: any) => (
                    <div key={provider.id}>
                        <div className="flex justify-center my-2">
                            <span className="text-gray-600">or</span>
                        </div>
                        <div className="flex justify-center mt-2 mb-4">
                            <button 
                                className="gsi-material-button"
                                onClick={() => {
                                    signIn(provider.id, { callbackUrl: '/complete-signup',  });
                                }}
                                type="button"
                            >
                                <div className="gsi-material-button-state"></div>
                                <div className="gsi-material-button-content-wrapper">
                                    <div className="gsi-material-button-icon">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: "block" }}>
                                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                        <path fill="none" d="M0 0h48v48H0z"></path>
                                    </svg>
                                    </div>
                                    <span className="gsi-material-button-contents">Sign up with Google</span>
                                    <span style={{ display: "none" }}>Sign up with Google</span>
                                </div>
                            </button>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default SignupForm;