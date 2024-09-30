// components/auth/Submit.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { useSignupContext } from "@/components/auth/SignupContext"
import { SendHorizonal } from "lucide-react";
    import { ClipLoader } from 'react-spinners'
import { useRouter } from "next/navigation";

export default function Submit() {
    const router = useRouter();
    const { formData, accountType, doctorSignupFormCompleted, triageSignupFormCompleted } = useSignupContext();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [animateFlyOff, setAnimateFlyOff] = useState(false);
    const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isSuccess && buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            setIconPosition({
                top: buttonRect.top + buttonRect.height / 2 - 10,
                left: buttonRect.left + buttonRect.width / 2 - 10,
            });
        }
    }, [isSuccess]);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    accountType,
                    securityQuestions: [
                        { question: formData.question1, answer: formData.answer1 },
                        { question: formData.question2, answer: formData.answer2 },
                        { question: formData.question3, answer: formData.answer3 },
                    ],
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    dob: formData.dob,
                    ...(accountType === 'Doctor' && {
                        doctorSpecialty: formData.doctorSpecialty,
                        languages: formData.languages,
                        countries: formData.countries,
                        gender: formData.gender,
                    }),
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    setAnimateFlyOff(true);
                    // Replace the current page in the history stack
                    window.history.pushState(null, '', window.location.pathname);
                    window.addEventListener('popstate', () => {
                        router.replace('/auth/signup-success');
                    });
                    setTimeout(() => {
                        router.replace('/auth/signup-success');
                    }, 2000);
                }, 100);
            }  else {
                console.error('Signup failed:', result.message);
            }
        } catch (error) {
            console.error('Error making API call:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormComplete = accountType === 'Doctor' ? doctorSignupFormCompleted : triageSignupFormCompleted;

    return (
        <div className="relative flex items-center justify-center">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <ClipLoader color="#FFA500" size={30} />
                </div>
            )}
            <Button
                ref={buttonRef}
                onClick={handleSubmit}
                disabled={isLoading || isSuccess || !isFormComplete}
                className={`group flex items-center justify-center px-4 py-2 rounded transition-all duration-300
                    ${isSuccess || isLoading || !isFormComplete
                    ? 'bg-transparent border-none shadow-none'
                    : 'bg-orange-200 text-orange-500 shadow-lg shadow-orange-50 border-2 border-orange-200 hover:bg-orange-500 hover:text-orange-700 hover:shadow-orange-200'
                }`}
            >
                <SendHorizonal className={`h-5 w-5 transition-colors duration-300
                    ${isSuccess
                    ? 'opacity-0'
                    : isLoading || !isFormComplete
                        ? 'text-orange-500'
                        : 'text-orange-500 group-hover:text-orange-50 ml-2'
                }`}
                />
            </Button>

            {isSuccess && (
                <div
                    className={`fixed z-50 ${animateFlyOff ? 'fly-right' : ''}`}
                    style={{
                        top: `${iconPosition.top}px`,
                        left: `${iconPosition.left}px`,
                    }}
                >
                    <SendHorizonal className="h-5 w-5 text-orange-500" />
                </div>
            )}

            <style jsx>{`
              @keyframes flyRight {
                0% {
                  transform: translateX(0);
                  opacity: 1;
                }
                100% {
                  transform: translateX(calc(100vw - 100%));
                  opacity: 1;
                }
              }
              .fly-right {
                animation: flyRight 2s ease-in-out forwards;
              }
              @keyframes fadeIn {
                from { opacity: 1; }
                to { opacity: 1; }
              }
              .animate-fade-in {
                animation: fadeIn 0.5s ease-in-out;
              }
            `}</style>
        </div>
    );
}