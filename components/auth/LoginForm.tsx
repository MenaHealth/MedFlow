// components/auth/LoginForm.tsx
'use client';

import { useForm, FormProvider } from "react-hook-form";
import useToast from '../hooks/useToast';
import {useEffect, useState} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { Button } from "@/components/ui/button";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";

const loginSchema = z.object({
    email: z.string().nonempty("Email is required.").email("Please enter a valid email address."),
    password: z.string().nonempty("Password is required.").min(8, "incorrect password"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface Props {
    accountType?: 'Doctor' | 'Triage';
}

export function LoginForm({ accountType }: Props) {
    const router = useRouter();
    const { setToast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

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
        console.log("Login submission started", data);
        setSubmitting(true);

        try {
            const response = await fetch('/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            console.log("Login response status:", response.status);

            if (response.ok) {
                console.log("Login successful");
                setToast?.({ title: '✓', description: 'You have successfully logged in.', variant: 'default' });

                // Add a delay before redirecting
                setTimeout(() => {
                    console.log("Attempting to redirect to dashboard");
                    router.push('/patient-info/dashboard');
                }, 1000); // Increased delay to 1 second for debugging
            } else if (response.status === 401) {
                console.log("Login failed: Incorrect credentials");
                setToast?.({ title: 'Login Error', description: 'Incorrect login credentials.', variant: 'destructive' });
            } else {
                const result = await response.json();
                console.log("Login failed:", result.message);
                setToast?.({ title: 'Login Error', description: result.message, variant: 'error' });
            }
        } catch (error) {
            console.error("Unexpected login error:", error);
            setToast?.({ title: 'Login Error', description: 'An unexpected error occurred. Please try again.', variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        console.log("LoginForm mounted");
        return () => {
            console.log("LoginForm unmounted");
        };
    }, []);

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
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
            {!showForgotPassword && (
                <p className="text-sm text-gray-600 mt-4">
                    <a href="#" onClick={() => setShowForgotPassword(true)}>Forgot password?</a>
                </p>
            )}
        </div>
    );
}

export default LoginForm;