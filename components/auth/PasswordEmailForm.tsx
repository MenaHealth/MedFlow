import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import PasswordFormField from '@/components/ui/passwordFormField';
import { useSignupContext } from './SignupContext';
import EmailField from "@/components/ui/emailField";
import { getProviders, signIn } from 'next-auth/react';

const passwordEmailSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type PasswordEmailFormValues = z.infer<typeof passwordEmailSchema>;

const PasswordEmailForm = () => {
    const {
        formData,
        setFormData,
        updateAnsweredQuestions,
        setValidEmail,
        setPasswordsMatch,
        accountType,
    } = useSignupContext();

    const form = useForm<PasswordEmailFormValues>({
        resolver: zodResolver(passwordEmailSchema),
        defaultValues: {
            email: formData.email || '',
            password: formData.password || '',
            confirmPassword: formData.confirmPassword || '',
        },
        mode: 'onChange',
    });

    const email = form.watch('email');
    const password = form.watch('password');
    const confirmPassword = form.watch('confirmPassword');

    const [providers, setProviders] = useState<any>(null);

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
            setProviders(res);
        };
        fetchProviders();
    }, []);

    useEffect(() => {
        const emailFilled = !!email;
        const passwordFilled = !!password;
        const confirmPasswordFilled = !!confirmPassword;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(email);

        updateAnsweredQuestions(1, Number(emailFilled) + Number(passwordFilled) + Number(confirmPasswordFilled));

        setFormData((prevData) => ({
            ...prevData,
            email,
            password,
            confirmPassword,
        }));

        setPasswordsMatch(password === confirmPassword && passwordFilled);
        setValidEmail(isEmailValid);
    }, [email, password, confirmPassword, updateAnsweredQuestions, setFormData, setPasswordsMatch, setValidEmail]);

    const handleProviderCallback = (id: any) => {
        if (accountType) {
            localStorage.setItem('accountType', accountType);
        }
        signIn(id, { redirect: false, callbackUrl: '/auth' });
    };

    return (
        <>
            <Form {...form}>
                <form className="h-full flex flex-col space-y-6 lg:space-y-8 lg:w-1/2 mx-auto py-8">
                    {/* Email Field */}
                    <EmailField
                        form={form}
                        fieldName="email"
                        fieldLabel="Email"
                    />
                    {/* Password Fields */}
                    <PasswordFormField
                        form={form}
                        fieldName="password"
                        fieldLabel="Password"
                    />
                    <PasswordFormField
                        form={form}
                        fieldName="confirmPassword"
                        fieldLabel="Confirm Password"
                    />
            {providers &&
                Object.values(providers).filter((provider: any) => provider.id !== 'credentials').map((provider: any) => (
                    <div key={provider.id}>
                        <div className="flex justify-center my-2">
                            <span className="text-gray-600">or</span>
                        </div>
                        <div className="flex justify-center mt-2 mb-4">
                            <button 
                                className="gsi-material-button"
                                onClick={() => handleProviderCallback(provider.id)}
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
                                    <span className="gsi-material-button-contents">Sign up with Google</span>
                                    <span style={{ display: "none" }}>Sign up with Google</span>
                                </div>
                            </button>
                        </div>
                    </div>
                ))
            }
                </form>
            </Form>
        </>
    );
};

export default PasswordEmailForm;