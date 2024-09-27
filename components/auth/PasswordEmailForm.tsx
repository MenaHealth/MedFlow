import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import PasswordField from '@/components/ui/passwordField';
import { useSignupContext } from './SignupContext';
import EmailField from "@/components/ui/emailField";

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

    return (
        <Form {...form}>
            <form className="h-full flex flex-col justify-between space-y-6 lg:space-y-8 lg:w-1/2 mx-auto py-8">
                {/* Email Field */}
                <EmailField
                    form={form}
                    fieldName="email"
                    fieldLabel="Email"
                />
                {/* Password Fields */}
                <PasswordField
                    form={form}
                    fieldName="password"
                    fieldLabel="Password"
                />
                <PasswordField
                    form={form}
                    fieldName="confirmPassword"
                    fieldLabel="Confirm Password"
                />
            </form>
        </Form>
    );
};

export default PasswordEmailForm;