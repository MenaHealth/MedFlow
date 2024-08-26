import { useContext, useState } from 'react';
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

const signupSchema = z.object({
    email: z.string().regex(emailRegex, "Invalid email address"),
    password: z.string().regex(passwordRegex, "Password requires 7+ letters and at least one number"),
    confirmPassword: z.string(),
    name: z.string().min(1, "last name is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface Props {
    accountType: 'Doctor' | 'TriageSpecialist';
}

const SignupForm = ({ accountType }: Props) => {
    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
        },
    });

    const { setToast } = useContext(ToastContext);
    if (!setToast) {
        console.error('Toast context not available');
    }
    const router = useRouter();

    const [submitting, setSubmitting] = useState(false);

    const onError = (errors: any) => {
        console.log('Form validation errors:', errors);
        const errorMessages = [];

        if (errors.email) {
            if (errors.email.type === 'regex') {
                errorMessages.push('Please enter a valid email address.');
            } else {
                errorMessages.push('Please enter an email address.');
            }
        }

        if (errors.password) {
            if (errors.password.type === 'regex') {
                errorMessages.push('Password requires 7+ letters and at least one number.');
            } else {
                errorMessages.push('Please enter a password.');
            }
        }

        if (errors.confirmPassword) {
            errorMessages.push('Please ensure your passwords match.');
        }

        if (errors.name) {
            errorMessages.push('Please enter your last name.');
        }

        if (errorMessages.length > 0) {
            setToast({
                title: 'Form Validation Errors',
                description: errorMessages.join('\n'),
                variant: 'destructive'
            });
        } else {
            setToast({
                title: 'Form Validation Error',
                description: 'Please correct the errors in the form.',
                variant: 'destructive'
            });
        }
    };

    const onSubmit = async (data: SignupFormValues) => {
        console.log('Form is valid, attempting submission');
        setSubmitting(true);

        try {
            console.log('Attempting to fetch');
            const response = await fetch(`/api/auth/signup/${accountType.toLowerCase()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            console.log('Fetch response:', response);
            if (response.ok) {
                setToast({ title: `${accountType} signed up successfully`, description: `You have successfully signed up as a ${accountType}.`, variant: 'success' });
                router.push('/auth/login'); // Redirect to login page
            } else {
                const result = await response.json();
                setToast({ title: 'Signup Error', description: result.message, variant: 'destructive' });
            }
        } catch (error) {
            console.error('Submission error:', error);
            setToast({ title: 'Signup Error', description: 'An unexpected error occurred. Please try again.', variant: 'destructive' });
        } finally {
            setSubmitting(false);
        }
    };

    console.log('Form state:', form.formState);
    return (
        <div className="w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Sign up as a {accountType}</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
                    <TextFormField
                        form={form}
                        fieldName="email"
                        fieldLabel="Email"
                        error={form.formState.errors.email?.message}
                    />
                    <TextFormField
                        form={form}
                        fieldName="password"
                        fieldLabel="Password"
                        type="password"
                        error={form.formState.errors.password?.message}
                        description="Password requires 7+ letters and at least one number"
                    />
                    <TextFormField
                        form={form}
                        fieldName="confirmPassword"
                        fieldLabel="Confirm Password"
                        type="password"
                        error={form.formState.errors.confirmPassword?.message}
                    />
                    <TextFormField
                        form={form}
                        fieldName="name"
                        fieldLabel="Last Name"
                        error={form.formState.errors.name?.message}
                    />
                    <div className="flex justify-between items-center mt-6">
                        <Button
                            type="submit"
                            disabled={submitting}
                            onClick={() => console.log('Submit button clicked')}
                        >
                            {submitting ? "Submitting..." : "Sign Up"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default SignupForm;