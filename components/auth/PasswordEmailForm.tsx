import React, {useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
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
        accountType,
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

    // Update answered questions based on form state
    const email = form.watch('email');
    const password = form.watch('password');
    const confirmPassword = form.watch('confirmPassword');

    useEffect(() => {
        const emailFilled = !!email;
        const passwordFilled = !!password;
        const confirmPasswordFilled = !!confirmPassword;

        // Check if the email follows regex rules
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(email);

        // Update answered questions
        updateAnsweredQuestions(1, Number(emailFilled) + Number(passwordFilled) + Number(confirmPasswordFilled));

        setFormData((prevData) => {
            const newData = {
                ...prevData,
                email,
                password,
                confirmPassword,
            };
            return newData;
        });

        setPasswordsMatch(password === confirmPassword && passwordFilled);
        setValidEmail(isEmailValid);
    }, [email, password, confirmPassword, updateAnsweredQuestions, setFormData, setPasswordsMatch, setValidEmail]);

    return (
        <Form {...form}>
            <form className="space-y-4">
                <EmailField
                    form={form}
                    fieldName="email"
                    fieldLabel="Email"
                />
                <PasswordField
                    form={form}
                    fieldName="password"
                    fieldLabel="Password"
                />
                <PasswordField form={form} fieldName="confirmPassword" fieldLabel="Confirm Password" />
            </form>
        </Form>
    );
};

export default PasswordEmailForm;