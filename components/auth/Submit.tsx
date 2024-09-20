'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { useSignupContext } from "@/components/auth/SignupContext"
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { ClipLoader } from 'react-spinners'

export default function Submit() {
    const { formData, accountType } = useSignupContext();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [animateFlyOff, setAnimateFlyOff] = useState(false);
    const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);

    // Track icon position once the form is successfully submitted
    // useEffect(() => {
    //     if (buttonRef.current) {
    //         const buttonRect = buttonRef.current.getBoundingClientRect();
    //         const parentRect = buttonRef.current.parentNode.getBoundingClientRect();
    //         const containerRect = buttonRef.current.parentNode.parentNode.getBoundingClientRect();
    //
    //         // Log the relevant dimensions for debugging
    //         console.log('Button rect:', buttonRect);
    //         console.log('Parent rect:', parentRect);   // Direct parent of button
    //         console.log('Container rect:', containerRect);  // Higher-level container
    //
    //         // Set the initial icon position
    //         setIconPosition({
    //             top: buttonRect.top - parentRect.top,
    //             left: buttonRect.left - parentRect.left + buttonRect.width / 2,
    //         });
    //     }
    // }, [isSuccess]);

    useEffect(() => {
        if (isSuccess && buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            setIconPosition({
                top: buttonRect.top + window.scrollY + buttonRect.height / 2 - 10, // 10 is half the icon height
                left: buttonRect.left + buttonRect.width / 2 - 10, // 10 is half the icon width
            });
        }
    }, [isSuccess]);

    // Track animation progress and log icon movement
    useEffect(() => {
        if (animateFlyOff) {
            console.log('Animation started for fly-right');
            setTimeout(() => {
                // Log the final icon position after the animation (delayed to match the animation duration)
                console.log('Final Icon Position:', iconPosition);
            }, 2000); // 2 seconds matches the animation duration
        }
    }, [animateFlyOff, iconPosition]);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            console.log('Form Data:', formData);

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
                    doctorSpecialty: formData.doctorSpecialty,
                    languages: formData.languages,
                    countries: formData.countries,
                    gender: formData.gender,
                }),
            });

            const result = await response.json();
            console.log('Signup API Response:', result);

            if (response.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    setAnimateFlyOff(true);
                }, 100);
                setTimeout(() => {
                    setShowSuccessMessage(true);
                }, 2000);
            } else {
                console.error('Signup failed:', result.message);
            }
        } catch (error) {
            console.error('Error making API call:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative h-20">
            <Button
                ref={buttonRef}
                onClick={handleSubmit}
                disabled={isLoading || isSuccess}
                className={`group flex items-center justify-center px-4 py-2 rounded transition-all duration-300
                    ${isSuccess
                    ? 'bg-transparent'
                    : 'bg-orange-200 text-orange-500 shadow-lg shadow-orange-50 border-2 border-orange-200 hover:bg-orange-500 hover:text-orange-700 hover:shadow-orange-200'
                }`}
            >
                {isLoading ? (
                    <ClipLoader color="#ffffff" size={20} />
                ) : (
                    <>
                        <span className={isSuccess ? 'opacity-0' : ''}></span>
                        <PaperPlaneIcon className={`h-5 w-5 ml-2 transition-colors duration-300
                            ${isSuccess
                            ? 'opacity-0'
                            : 'text-orange-500 group-hover:text-orange-50'
                        }`}
                        />
                    </>
                )}
            </Button>

            {isSuccess && (
                <div
                    className={`fixed z-50 ${animateFlyOff ? 'fly-right' : ''}`}
                    style={{
                        top: `${iconPosition.top}px`,
                        left: `${iconPosition.left}px`,
                    }}
                >
                    <PaperPlaneIcon className="h-5 w-5 text-orange-500" />
                </div>
            )}

            {showSuccessMessage && (
                <div className="absolute top-full left-0 right-0 mt-2 text-center text-green-600 animate-fade-in">
                    Signup successful!
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
                  opacity: 0;
                }
              }
              .fly-right {
                animation: flyRight 2s ease-in-out forwards;
              }
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-fade-in {
                animation: fadeIn 0.5s ease-in-out;
              }
            `}</style>
        </div>
    );
}