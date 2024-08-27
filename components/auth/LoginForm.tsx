// components/auth/LoginForm.tsx
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/form/TextFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useContext, useState } from "react";
import { ToastContext } from '@/components/ui/toast';

const loginSchema = z.object({
    email: z.string().nonempty("Email is required.").email("Please enter a valid email address."),
    password: z.string().nonempty("Password is required.").min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { setToast } = useContext(ToastContext);
    const [submitting, setSubmitting] = useState(false);

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
            setToast({
                title: '!',
                description: errorMessages.join('\n'),
                variant: 'destructive',
            });
        }
    };

    const onSubmit = async (data: LoginFormValues) => {
        setSubmitting(true);

        try {
            const response = await fetch('/api/auth/login/doctor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setToast({ title: 'Login Successful', description: 'You have successfully logged in.', variant: 'default' });
                // Optionally, redirect to a protected route
            } else if (response.status === 401) {
                // 401 Unauthorized means incorrect login credentials
                setToast({ title: 'Login Error', description: 'Incorrect login credentials.', variant: 'error' });
            } else {
                const result = await response.json();
                setToast({ title: 'Login Error', description: result.message, variant: 'error' });
            }
        } catch (error) {
            setToast({ title: 'Login Error', description: 'An unexpected error occurred. Please try again.', variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Login</h2>
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
        </div>
    );
}

export default LoginForm;