// components/auth/LoginForm.tsx
'use client';

import { useForm } from "react-hook-form";
import useToast from '../hooks/useToast';
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const loginSchema = z.object({
    email: z.string().nonempty("Email is required.").email("Please enter a valid email address."),
    password: z.string().nonempty("Password is required.").min(8, ""),
    accountType: z.enum(['Doctor', 'Triage']),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface Props {
    accountType?: 'Doctor' | 'Triage';
}

export function LoginForm({ accountType }: Props) {
    const router = useRouter();
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            accountType: accountType,
        },
    });

    const { setToast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

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
                title: '!',
                description: errorMessages.join('\n'),
                variant: 'destructive',
            });
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
                redirect: false,
                accountType,
            });

            if (response && !response.error) {
                setToast?.({ title: '✓', description: 'You have successfully logged in.', variant: 'default' });
                router.push('/patient-info/dashboard');
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
        <div className="w-full max-w-md">
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
                    />
                    <div className="flex justify-center mt-6">
                        <Button
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? "Submitting..." : "Login"}
                        </Button>
                    </div>
                </form>
            </Form>
            {showForgotPassword && (
                <div className="forgot-password-card w-full p-8 rounded-lg shadow-lg bg-white bg-opacity-10 backdrop-filter backdrop-blur-md">
                    <ForgotPasswordForm />
                    <button className="text-sm text-gray-600 hover:text-gray-800" onClick={() => setShowForgotPassword(false)}>
                        Back to login
                    </button>
                </div>

            )}

            <p className="text-sm text-gray-600">
                <a href="#" onClick={() => setShowForgotPassword(true)}>Forgot password?</a>
            </p>
        </div>
    );
}

export default LoginForm;