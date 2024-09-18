import React, {useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { Form } from "@/components/ui/form";
import PasswordField from '@/components/ui/PasswordField';
import { useSignupContext } from './SignupContext';

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
        setPasswordsMatch // Add this
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

    // Total questions differ for Doctor and Triage
    const totalQuestions = accountType === 'Doctor' ? 14 : 11;

    // Update answered questions based on form state
    const email = form.watch('email');
    const password = form.watch('password');
    const confirmPassword = form.watch('confirmPassword');

    useEffect(() => {
        const emailFilled = !!email;
        const passwordFilled = !!password;
        const confirmPasswordFilled = !!confirmPassword;

        updateAnsweredQuestions(1, emailFilled + passwordFilled + confirmPasswordFilled);

        setFormData((prevData) => ({
            ...prevData,
            email,
            password,
            confirmPassword,
        }));

        // Update passwordsMatch state
        setPasswordsMatch(password === confirmPassword && passwordFilled);
    }, [email, password, confirmPassword, updateAnsweredQuestions, setFormData]);

    return (
        <Form {...form}>
            <form className="space-y-4">
                <TextFormField form={form} fieldName="email" fieldLabel="Email" />
                <PasswordField
                    form={form}
                    fieldName="password"
                    fieldLabel="Password"
                    tooltipOnType="Password must be at least 8 characters and include one number"
                />
                <PasswordField form={form} fieldName="confirmPassword" fieldLabel="Confirm Password" />
            </form>
        </Form>
    );
};

export default PasswordEmailForm;