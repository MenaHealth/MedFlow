import React, { useEffect } from 'react';
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
    const { formData, setFormData, updateAnsweredQuestions, accountType } = useSignupContext();

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
    useEffect(() => {
        const emailFilled = form.watch('email') ? 1 : 0;
        const passwordFilled = form.watch('password') ? 1 : 0;
        const confirmPasswordFilled = form.watch('confirmPassword') ? 1 : 0;

        // Update answered questions for this step (step 1: PasswordEmailForm)
        updateAnsweredQuestions(1, emailFilled + passwordFilled + confirmPasswordFilled);

        // Update form data in context
        setFormData((prevData) => ({
            ...prevData,
            email: form.getValues('email'),
            password: form.getValues('password'),
            confirmPassword: form.getValues('confirmPassword'),
        }));
    }, [form.watch('email'), form.watch('password'), form.watch('confirmPassword'), setFormData, updateAnsweredQuestions]);

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