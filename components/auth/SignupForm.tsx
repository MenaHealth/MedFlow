import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import useToast from "@/components/hooks/useToast";
import SecurityQuestionsForm from './SecurityQuestionsForm';
import DoctorSignupForm from './DoctorSignupForm';
import TriageSignupForm from './TriageSignupForm';
import NextButton from '@/components/auth/NextButton';

const signupSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface Props {
    accountType: 'Doctor' | 'Triage';
}

const SignupForm = ({ accountType }: Props) => {
    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const { setToast } = useToast();
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<any>({});
    const [progress, setProgress] = useState(0);

    const totalSteps = accountType === 'Doctor' ? 4 : 3;

    useEffect(() => {
        const calculateProgress = () => {
            const stepProgress = (currentStep - 1) / totalSteps;
            const fieldProgress = Object.values(formData).filter(Boolean).length / (totalSteps * 3);
            setProgress(stepProgress + fieldProgress);
        };

        calculateProgress();
    }, [currentStep, formData, totalSteps]);

    const handleNext = (data: any) => {
        setFormData({ ...formData, ...data });
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    accountType,
                }),
            });

            if (response.ok) {
                setToast({
                    title: `${accountType} signed up successfully`,
                    description: `You have successfully signed up as a ${accountType}.`,
                    variant: 'success',
                });
                router.push('/dashboard');
            } else {
                const result = await response.json();
                setToast({ title: 'Signup Error', description: result.message, variant: 'destructive' });
            }
        } catch (error) {
            console.error('Signup error:', error);
            setToast({ title: 'Error', description: 'An unexpected error occurred', variant: 'destructive' });
        }
    };

    const renderProgressBar = () => (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
                className="bg-orange h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress * 100}%` }}
            ></div>
        </div>
    );

    const renderForm = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleNext)} className="space-y-4">
                            <TextFormField form={form} fieldName="email" fieldLabel="Email" />
                            <TextFormField form={form} fieldName="password" fieldLabel="Password" type="password" />
                            <TextFormField form={form} fieldName="confirmPassword" fieldLabel="Confirm Password" type="password" />
                        </form>
                    </Form>
                );
            case 2:
                return <SecurityQuestionsForm onDataChange={setFormData} formData={formData} />;
            case 3:
                return accountType === 'Doctor' ?
                    <DoctorSignupForm onDataChange={setFormData} formData={formData} /> :
                    <TriageSignupForm onDataChange={setFormData} formData={formData} />;
            case 4:
                return accountType === 'Doctor' ? <DoctorSignupForm onDataChange={setFormData} formData={formData} /> : null;
            default:
                return null;
        }
    };

    const isNextDisabled = () => {
        if (currentStep === 1) {
            return !form.formState.isValid;
        }
        // Add logic for other steps if needed
        return false;
    };

    return (
        <div className="w-full max-w-md">
            {renderProgressBar()}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">{accountType} Signup - Step {currentStep}</h2>
                {renderForm()}
                <div className="flex justify-between mt-6">
                    {currentStep > 1 && (
                        <Button onClick={handleBack} className="bg-gray-300 hover:bg-gray-400 text-black">
                            Back
                        </Button>
                    )}
                    <NextButton
                        onClick={form.handleSubmit(handleNext)}
                        isDisabled={isNextDisabled()}
                    />
                </div>
            </div>
        </div>
    );
};

export default SignupForm;