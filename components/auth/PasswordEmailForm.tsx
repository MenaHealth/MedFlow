import React, { useCallback, useEffect } from 'react';
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
        setIsFormComplete,
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

    // Update formData when the form fields change
    useEffect(() => {
        const subscription = form.watch((values) => {
            setFormData((prevData) => ({
                ...prevData,
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword,
            }));
        });
        return () => subscription.unsubscribe();
    }, [form.watch, setFormData]);

    const updateIsFormComplete = useCallback(() => {
        setIsFormComplete(form.formState.isValid);
    }, [form.formState.isValid, setIsFormComplete]);

    useEffect(() => {
        updateIsFormComplete();
    }, [updateIsFormComplete, form.formState.isValid]);

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