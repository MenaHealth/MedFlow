// components/auth/LoginForm.tsx
'use client';

import { useForm, FormProvider } from "react-hook-form";
import useToast from '../hooks/useToast';
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import ForgotPasswordForm from "@/components/auth/forgotPassword/ForgotPasswordForm";
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
    const [showPassword, setShowPassword] = useState(false);

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
            errorMessages.push(errors.email.message);
        }
        if (errors.password) {
            errorMessages.push(errors.password.message);
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
            });
            if (response && !response.error) {
                setToast?.({ title: '✓', description: 'You have successfully logged in.', variant: 'default' });
                router.replace('/patient-info/dashboard');
            } else if (response?.error) {
                setToast?.({ title: 'Login Error', description: response.error, variant: 'error' });
            }
        } catch (error) {
            setToast?.({ title: 'Login Error', description: 'An unexpected error occurred. Please try again.', variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full md:max-w-md bg-white p-4 md:p-8 rounded-lg shadow-md">
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
                    <div className="relative">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...form.register("email")}
                            className="mt-1 block w-full px-3 py-2 pr-16 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            {...form.register("password")}
                            className="mt-1 block w-full px-3 py-2 pr-16 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-gray-600 text-sm"
                            style={{ top: "50%", transform: "translateY(3%)" }}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <div className="flex justify-center mt-6">
                        <Button type="submit" disabled={submitting} variant={'submit'}>
                            Login
                            {submitting && (
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                                    <BarLoader />
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </FormProvider>
            {!showForgotPassword && (
                <p className="text-sm text-gray-600 mt-4">
                    <a href="#" onClick={() => setShowForgotPassword(true)}>Forgot password?</a>
                </p>
            )}
            {showForgotPassword && (
                <div className="forgot-password-card w-full p-8 rounded-lg shadow-lg bg-white bg-opacity-10 backdrop-filter backdrop-blur-md">
                    <ForgotPasswordForm />
                    <button className="text-sm text-gray-600 hover:text-gray-800" onClick={() => setShowForgotPassword(false)}>
                        Back to login
                    </button>
                </div>
            )}
        </div>
    );
}

export default LoginForm;
