// components/auth/LoginForm.tsx
'use client';

import { useForm, FormProvider } from "react-hook-form";
import useToast from '../hooks/useToast';
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { Button } from "@/components/ui/button";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useRouter } from "next/navigation";
import { signIn, getProviders } from "next-auth/react";
import { BarLoader } from "react-spinners";

const loginSchema = z.object({
    email: z.string().nonempty("Email is required.").email("Please enter a valid email address."),
    password: z.string().nonempty("Password is required.").min(8, "incorrect password"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();
    const { setToast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [providers, setProviders] = useState<any>(null);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
            setProviders(res);
        };
        fetchProviders();
    }, []);

    const onError = (errors: any) => {
        const errorMessages = [];

        if (errors.email) {
            if (errors.email.type === 'nonempty') {
                errorMessages.push('Email is missing.');
            } else {
                errorMessages.push(errors.email.message);
            }
        }

        if (errors.password) {
            if (errors.password.type === 'nonempty') {
                errorMessages.push('Password is missing.');
            } else {
                errorMessages.push(errors.password.message);
            }
        }

        if (errorMessages.length > 0) {
            setToast?.({
                title: '❌',
                description: errorMessages.join('\n'),
                variant: 'error',
            });
        }
    };

    const onSubmit = async (data: LoginFormValues) => {
        setSubmitting(true);

        try {
            const response = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false
            });

            if (response && !response.error) {
                setToast?.({ title: '✓', description: 'You have successfully logged in.', variant: 'default' });
                router.replace('/patient-info/dashboard');
                // Optionally, redirect to a protected route
            } else if (response && response.status === 401) {
                // 401 Unauthorized means incorrect login credentials
                setToast?.({ title: 'Login Error', description: 'Incorrect login credentials.', variant: 'destructive' });
            } else {
                // const result = await response.json();
                // setToast?.({ title: 'Login Error', description: result.message, variant: 'error' });
            }
        } catch (error) {
            setToast?.({ title: 'Login Error', description: 'An unexpected error occurred. Please try again.', variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full md:max-w-md bg-white p-4 md:p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
                    <TextFormField
                        fieldName="email"
                        fieldLabel="Email"
                        error={form.formState.errors.email?.message}
                        autoComplete="email"
                    />
                    <TextFormField
                        fieldName="password"
                        fieldLabel="Password"
                        type="password"
                        error={form.formState.errors.password?.message}
                    />
                    <div className="flex justify-center mt-6">
                        <Button
                            type="submit"
                            disabled={submitting}
                        > Login
                            {submitting && (
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                                    <BarLoader />
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </FormProvider>
            {showForgotPassword && (
                <div className="forgot-password-card w-full p-8 rounded-lg shadow-lg bg-white bg-opacity-10 backdrop-filter backdrop-blur-md">
                    <ForgotPasswordForm />
                    <button className="text-sm text-gray-600 hover:text-gray-800" onClick={() => setShowForgotPassword(false)}>
                        Back to login
                    </button>
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
                                    signIn(provider.id, { callbackUrl: '/patient-info/dashboard' });
                                }}
                                type="button"
                            >
                                <div className="gsi-material-button-state"></div>
                                <div className="gsi-material-button-content-wrapper">
                                    <div className="gsi-material-button-icon">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: 'block' }}>
                                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                        <path fill="none" d="M0 0h48v48H0z"></path>
                                    </svg>
                                    </div>
                                    <span className="gsi-material-button-contents">Sign in with Google</span>
                                    <span style={{ display: "none" }}>Sign in with Google</span>
                                </div>
                            </button>
                        </div>
                    </div>
                ))
            }

            {!showForgotPassword && (
                <p className="text-sm text-gray-600 mt-4">
                    <a href="#" onClick={() => setShowForgotPassword(true)}>Forgot password?</a>
                </p>
            )}
        </div>
    );
}

export default LoginForm;