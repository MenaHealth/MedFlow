import React from 'react';
import { Button } from "@/components/ui/button";
import { useSignupContext } from "@/components/auth/SignupContext";
import { useFormContext } from 'react-hook-form';

const Submit = () => {
    const { formData, accountType } = useSignupContext();
    const formContext = useFormContext();

    const handleSubmit = async () => {
        try {
            const data = formContext.getValues();
            console.log('Form Data:', formData);  // Log all formData
            console.log('Password:', formData.password);  // Log password to check its value

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,  // Check if password is correctly populated
                    accountType,
                    securityQuestions: [
                        { question: formData.question1, answer: formData.answer1 },
                        { question: formData.question2, answer: formData.answer2 },
                        { question: formData.question3, answer: formData.answer3 },
                    ],
                    firstName: data.firstName,
                    lastName: data.lastName,
                    dob: data.dob,
                    doctorSpecialty: data.doctorSpecialty,
                    languages: data.languages,
                    countries: data.countries,
                    gender: data.gender,
                }),
            });

            const result = await response.json();
            console.log('Signup API Response:', result);  // Log API response

        } catch (error) {
            console.error('Error making API call:', error);
        }
    };

    const isValid = Object.keys(formContext.formState.errors).length === 0;

    return (
        <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`group flex items-center justify-center px-4 py-2 rounded transition-all duration-300
                ${isValid
                ? 'bg-orange-200 text-orange-500 shadow-lg shadow-orange-50 border-2 border-orange-200 hover:bg-orange-500 hover:text-orange-700 hover:shadow-orange-200'
                : 'bg-transparent text-orange-200 border-2 border-orange-200 hover:text-orange-700 hover:bg-transparent'
            }`}
        >
            Submit
        </Button>
    );
};

export default Submit;