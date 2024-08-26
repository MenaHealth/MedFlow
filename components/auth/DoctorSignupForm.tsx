// components/auth/DoctorSignupForm.tsx
import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/form/TextFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ToastContext } from '@/components/ui/toast';
import { useRouter } from "next/navigation";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[0-9]).{8,}$/;

const doctorSignupSchema = z.object({
    email: z.string().regex(emailRegex, "Invalid email address"),
    password: z.string().regex(passwordRegex, "Password requires 7+ letters and at least one number"),
    confirmPassword: z.string(),
    name: z.string().min(1, "last name is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type DoctorSignupFormValues = z.infer<typeof doctorSignupSchema>;

const DoctorSignupForm = () => {
    const form = useForm<DoctorSignupFormValues>({
        resolver: zodResolver(doctorSignupSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
        },
    });

    const { setToast } = useContext(ToastContext);
    const router = useRouter();

    useEffect(() => {
        if (form.formState.errors) {
            const errorMessages = Object.values(form.formState.errors).map((error) => error.message);
            if (errorMessages.length > 0) {
                setToast({ title: 'Validation Error', description: errorMessages.join(', '), variant: 'destructive' });
            }
        }
    }, [form.formState.errors, setToast]);

    const toastContext = useContext(ToastContext);

    if (!toastContext) {
        throw new Error('ToastContext must be used within a ToastProvider');
    }

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
                setToast({ title: 'Doctor signed up successfully', description: 'You have successfully signed up as a doctor.', variant: 'success' });
                router.push('/auth/login'); // Redirect to login page
            } else {
                const result = await response.json();
                setToast({ title: 'Signup Error', description: result.message, variant: 'destructive' });
            }
        } catch (error) {
            setToast({ title: 'Signup Error', description: 'An unexpected error occurred. Please try again.', variant: 'destructive' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Sign up as a Doctor</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <TextFormField
                        form={form}
                        fieldName="email"
                        fieldLabel="Email"
                        error={form.formState.errors.email && form.formState.errors.email.message}
                    />
                    <TextFormField
                        form={form}
                        fieldName="password"
                        fieldLabel="Password"
                        type="password"
                        error={form.formState.errors.password && form.formState.errors.password.message}
                        description="Password requires 7+ letters and at least one number (!, @, #, $, %, ^, &, *)"
                    />
                    <p className="text-sm text-gray-500 mb-2"> Password requires 7+ letters and at least one number</p>
                    <TextFormField
                        form={form}
                        fieldName="confirmPassword"
                        fieldLabel="Confirm Password"
                        type="password"
                        error={form.formState.errors.confirmPassword && form.formState.errors.confirmPassword.message}
                        description="Password requires 7+ letters and at least one number (!, @, #, $, %, ^, &, *)"
                    />
                    <TextFormField
                        form={form}
                        fieldName="name"
                        fieldLabel="Last Name"
                        error={form.formState.errors.name && form.formState.errors.name.message}
                    />
                    <div className="flex justify-between items-center mt-6">
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Submitting..." : "Sign Up"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => {/* Handle login */}}>
                            Login
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default DoctorSignupForm;