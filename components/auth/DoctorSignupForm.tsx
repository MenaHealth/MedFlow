// components/auth/DoctorSignupForm.tsx
'use client'; // Ensure this component is a client component

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/form/TextFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ToastContext } from '@/components/ui/toast';
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";

const doctorSignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(1, "Name is required"),
});

type DoctorSignupFormValues = z.infer<typeof doctorSignupSchema>;

export function DoctorSignupForm() {
    const router = useRouter();
    const form = useForm<DoctorSignupFormValues>({
        resolver: zodResolver(doctorSignupSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
        },
    });

    const { setToast } = useContext(ToastContext);
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data: DoctorSignupFormValues) => {
        setSubmitting(true);

        try {
            const response = await fetch('/api/auth/signup/doctor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    accountType: 'Doctor',
                }),
            });

            if (response.ok) {
                setToast({ title: 'Doctor signed up successfully', description: 'You have successfully signed up as a doctor.', variant: 'default' });
                router.push('/auth/login'); // Redirect to login page
            } else {
                const result = await response.json();
                setToast({ title: 'Signup Error', description: result.message, variant: 'error' });
            }
        } catch (error) {
            setToast({ title: 'Signup Error', description: 'An unexpected error occurred. Please try again.', variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Sign up as a Doctor</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <TextFormField form={form} fieldName="email" fieldLabel="Email" />
                    <TextFormField form={form} fieldName="password" fieldLabel="Password" type="password" />
                    <TextFormField form={form} fieldName="name" fieldLabel="Name" />
                    <div className="flex justify-between items-center mt-6">
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Submitting..." : "Sign Up"}
                        </Button>
                        <Button variant="outline" onClick={() => {/* Handle login */}}>
                            Login
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default DoctorSignupForm;