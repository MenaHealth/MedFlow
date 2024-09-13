"use client"

import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFormField } from "@/components/ui/TextFormField";
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
            setProgress(Math.min(stepProgress + fieldProgress, 1)); // Ensure progress doesn't exceed 1
        };

        calculateProgress();
    }, [currentStep, formData, totalSteps]);

    const handleNext = (data: any) => {
        setFormData((prevData) => {
            const newData = { ...prevData, ...data };
            if (currentStep < totalSteps) {
                setCurrentStep(currentStep + 1);
            } else {
                handleSubmit(newData);
            }
            return newData;
        });
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (data: any) => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                setToast({ title: 'Success', description: result.message, variant: 'success' });
                router.push('/login');
            } else {
                setToast({ title: 'Error', description: result.message, variant: 'destructive' });
            }
        } catch (error) {
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
                return <SecurityQuestionsForm onDataChange={handleNext} formData={formData} />;
            case 3:
                return accountType === 'Doctor' ?
                    <DoctorSignupForm onDataChange={handleNext} formData={formData} /> :
                    <TriageSignupForm onDataChange={handleNext} formData={formData} />;
            case 4:
                return accountType === 'Doctor' ? <DoctorSignupForm onDataChange={handleNext} formData={formData} /> : null;
            default:
                return null;
        }
    };

    const isNextDisabled = () => {
        if (currentStep === 1) {
            return !form.formState.isValid;
        }
        if (currentStep === 2) {
            return !(formData.question1 && formData.answer1 && formData.question2 && formData.answer2 && formData.question3 && formData.answer3);
        }
        if (currentStep === 3 && accountType === 'Doctor') {
            return !(formData.firstName && formData.lastName && formData.dob && formData.doctorSpecialty && formData.languages.length && formData.countries.length && formData.gender);
        }
        return false;
    };

    return (
        <div className="w-full h-full flex flex-col">
            {renderProgressBar()}
            <div className="flex-grow overflow-y-auto">
                {renderForm()}
            </div>
            <div className="p-4 bg-white border-t flex justify-between">
                {currentStep > 1 && (
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    >
                        Back
                    </button>
                )}
                <NextButton
                    onClick={form.handleSubmit(handleNext)}
                    isDisabled={isNextDisabled()}
                />
            </div>
        </div>
    );
};

export default SignupForm;