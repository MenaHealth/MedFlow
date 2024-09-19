import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useSignupContext } from "@/components/auth/SignupContext";

const NextButton = () => {
    const {
        stepAnswers,
        currentStep,
        handleNext,
        accountType,
        passwordsMatch,
        securityQuestionFormCompleted
    } = useSignupContext();

    useEffect(() => {
        console.log('stepAnswers updated: ', stepAnswers);
    }, [stepAnswers]);

    const getTotalRequiredFieldsForStep = (step: number) => {
        switch (step) {
            case 0:
                return 1;
            case 1:
                return 3;  // Email, Password, Confirm Password
            case 2:
                return 6;  // 3 questions and 3 answers
            case 3:
                return accountType === 'Doctor' ? 4 : 4;
            default:
                return 0;
        }
    };

    const isCurrentStepComplete = () => {
        if (currentStep === 0) return accountType !== null;
        if (currentStep === 1) return stepAnswers[currentStep] === getTotalRequiredFieldsForStep(currentStep) && passwordsMatch;
        if (currentStep === 2) return securityQuestionFormCompleted;
        return stepAnswers[currentStep] === getTotalRequiredFieldsForStep(currentStep);
    };

    const canProceed = isCurrentStepComplete();

    console.log('NextButton: ');
    console.log('currentStep: ', currentStep);
    console.log('stepAnswers: ', stepAnswers);
    console.log('isCurrentStepComplete: ', isCurrentStepComplete());
    console.log('canProceed: ', canProceed);
    console.log('getTotalRequiredFieldsForStep(currentStep): ', getTotalRequiredFieldsForStep(currentStep));

    return (
        <Button
            onClick={handleNext}
            disabled={!canProceed}
            className={`group flex items-center justify-center px-4 py-2 rounded transition-all duration-300
                ${canProceed
                ? 'bg-orange-200 text-orange-500 shadow-lg shadow-orange-50 border-2 border-orange-200 hover:bg-orange-500 hover:text-orange-700 hover:shadow-orange-200'
                : 'bg-transparent text-orange-200 border-2 border-orange-200 hover:text-orange-700 hover:bg-transparent'
            }`}
        >
            <PaperPlaneIcon className={`h-5 w-5 transition-colors duration-300
                ${canProceed
                ? 'text-orange-500 group-hover:text-orange-50'
                : 'text-orange-200 group-hover:text-orange-700'
            }`} />
        </Button>
    );
};

export default NextButton;