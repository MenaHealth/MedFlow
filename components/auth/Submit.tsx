'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { useSignupContext } from "@/components/auth/SignupContext"
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { ClipLoader } from 'react-spinners'

export default function Submit() {
    const { formData, accountType } = useSignupContext()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [animateFlyOff, setAnimateFlyOff] = useState(false)
    const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 })
    const buttonRef = useRef(null)

    useEffect(() => {
        if (isSuccess && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setIconPosition({
                top: rect.top,
                left: rect.left + rect.width / 2,
            })
        }
    }, [isSuccess])

    const handleSubmit = async () => {
        setIsLoading(true)
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
                setAnimateFlyOff(true); // Trigger the fly-off animation
                setTimeout(() => {
                    setShowSuccessMessage(true); // Show success message after animation
                }, 2000); // Match duration with animation
            } else {
                console.error('Signup failed:', result.message);
            }
        }catch (error) {
            console.error('Error making API call:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative overflow-visible h-20">
            <Button
                ref={buttonRef}
                onClick={handleSubmit}
                className="group flex items-center justify-center px-4 py-2 rounded transition-all duration-300"
                disabled={isLoading || isSuccess}
            >
                {isLoading ? (
                    <ClipLoader color="#ffffff" size={20} />
                ) : (
                    <span className={`flex items-center ${animateFlyOff ? 'invisible' : ''}`}>
            {isSuccess ? 'Success' : 'Submit'}
          </span>
                )}
            </Button>

            {isSuccess && (
                <PaperPlaneIcon
                    className={`h-5 w-5 text-orange-500 absolute z-50 transition-all duration-1000 ease-in-out ${
                        animateFlyOff ? 'fly-off' : ''
                    }`}
                    style={{
                        top: `${iconPosition.top}px`,
                        left: `${iconPosition.left}px`,
                    }}
                />
            )}

            {showSuccessMessage && (
                <div className="absolute top-full left-0 right-0 mt-2 text-center text-green-600 animate-fade-in">
                    Signup successful!
                </div>
            )}

            <style jsx>{`
        .fly-off {
          transform: translate(0, -100vh) rotate(-45deg) !important;
          opacity: 0;
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
    )
}