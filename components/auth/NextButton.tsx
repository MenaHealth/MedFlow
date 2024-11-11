'use client';

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react";
import { useSignupContext } from "@/components/auth/SignupContext"
import { useToast } from "./../hooks/useToast"
import { Loader2 } from "lucide-react"

export default function NextButton() {
    const {
        stepAnswers,
        currentStep,
        handleNext,
        accountType,
        passwordsMatch,
        securityQuestionFormCompleted,
        formData,
        setEmailExists,
    } = useSignupContext()

    const { setToast } = useToast(); // Change toast to setToast
    const [loading, setLoading] = useState(false)

    const getTotalRequiredFieldsForStep = (step: number) => {
        switch (step) {
            case 0:
                return 1
            case 1:
                return 3
            case 2:
                return 6
            case 3:
                return accountType === 'Doctor' ? 4 : 4
            default:
                return 0
        }
    }

    const isCurrentStepComplete = () => {
        if (currentStep === 0) return accountType !== null
        if (currentStep === 1) return stepAnswers[currentStep] === getTotalRequiredFieldsForStep(currentStep) && passwordsMatch
        if (currentStep === 2) return securityQuestionFormCompleted
        return stepAnswers[currentStep] === getTotalRequiredFieldsForStep(currentStep)
    }

    const canProceed = isCurrentStepComplete()

    const handleEmailCheck = async () => {
        if (currentStep === 1 && formData.email && formData.email.trim() !== '') {
            try {
                const res = await fetch(`/api/auth/signup/email-check?email=${encodeURIComponent(formData.email)}`, {
                    method: 'GET',
                })

                const data = await res.json()

                if (res.status === 409 || data.exists) {
                    console.log('Email already exists')
                    setToast?.({
                        title: "Account already exists",
                        description: "Please login with this email or use another email to continue.",
                        variant: "destructive",
                    })
                    setEmailExists(true)
                    return false
                }

                if (res.status === 200 && !data.exists) {
                    console.log('Email is available')
                    setEmailExists(false)
                    return true
                }

                setToast?.({
                    title: "Error",
                    description: "Something went wrong. Please try again.",
                    variant: "destructive",
                })
                return false

            } catch (error) {
                console.error('Error checking email:', error)
                setToast?.({
                    title: "Error",
                    description: "Something went wrong. Please try again.",
                    variant: "destructive",
                })
                return false
            }
        }
        return true
    }

    const handleNextStep = async () => {
        if (!canProceed) {
            return
        }

        setLoading(true)

        if (currentStep === 1) {
            const emailCheckPassed = await handleEmailCheck()
            if (emailCheckPassed) {
                handleNext()
            }
        } else {
            handleNext()
        }

        setLoading(false)
    }

    return (
        <Button
            onClick={handleNextStep}
            disabled={!canProceed || loading}
            className={`group flex items-center justify-center px-4 py-2 rounded transition-all duration-300
        ${canProceed && !loading
                ? 'bg-orange-200 text-orange-500 shadow-lg shadow-orange-50 border-2 border-orange-200 hover:bg-orange-500 hover:text-orange-700 hover:shadow-orange-200'
                : 'bg-transparent text-orange-200 border-2 border-orange-200 hover:text-orange-700 hover:bg-transparent'
            }`}
        >
            {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <Send className={`h-5 w-5 transition-colors duration-300
          ${canProceed
                    ? 'text-orange-500 group-hover:text-orange-50'
                    : 'text-orange-200 group-hover:text-orange-700'
                }`} />
            )}
        </Button>
    )
}