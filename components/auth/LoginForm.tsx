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
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <TextFormField form={form} fieldName="email" fieldLabel="Email" />
                <TextFormField form={form} fieldName="password" fieldLabel="Password" type="password" />
                <Button type="submit" disabled={submitting}>
                    {submitting ? "Submitting..." : "Login"}
                </Button>
            </form>
        </Form>
    );
}

export default LoginForm;