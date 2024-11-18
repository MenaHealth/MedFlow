// components/auth/LoginForm.tsx
'use client';

import { useForm, FormProvider } from "react-hook-form";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signIn, getProviders } from "next-auth/react";
import { BarLoader } from "react-spinners";
import { useApi } from '@/components/hooks/useApi';

const loginSchema = z.object({
    email: z.string().nonempty("Email is required.").email("Please enter a valid email address."),
    password: z.string().nonempty("Password is required.").min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();
    const api = useApi();
    const [submitting, setSubmitting] = useState(false);
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

    const onSubmit = async (data: LoginFormValues) => {
        setSubmitting(true);
        try {
            const response = await api.signIn('credentials', {
                email: data.email,
                password: data.password,
            });

            if (response && !response.error) {
                router.replace('/patient-info/dashboard');
            } else {
                console.error('Login error:', response?.error);
            }
        } catch (error) {
            console.error('Unexpected login error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full md:max-w-md bg-white p-4 md:p-8 rounded-lg shadow-md">
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        </div>
    );
}

export default LoginForm;