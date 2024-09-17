import React from 'react';
import { Button } from "@/components/ui/button";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useSignupContext } from "@/components/auth/SignupContext";

const NextButton = () => {
    const { stepAnswers, currentStep, handleNext, accountType } = useSignupContext();

    // Ensure stepAnswers[currentStep] exists and is a number
    const isCurrentStepComplete = currentStep === 0 ? accountType !== null :
        stepAnswers && stepAnswers[currentStep] === getTotalRequiredFieldsForStep(currentStep);

    const getTotalRequiredFieldsForStep = (step: number) => {
        switch (step) {
            case 0:
                return 1; // UserTypeForm has 1 required field
            case 1:
                return 3; // PasswordEmailForm has 3 required fields
            // Add more cases for other steps
            default:
                return 0;
        }
    };


    return (
        <Button
            onClick={handleNext}
            disabled={!isCurrentStepComplete}
            className={`group flex items-center justify-center px-4 py-2 rounded transition-all duration-300
                ${isCurrentStepComplete
                ? 'bg-orange-200 text-orange-500 shadow-lg shadow-orange-50 border-2 border-orange-200 hover:bg-orange-500 hover:text-orange-700 hover:shadow-orange-200'
                : 'bg-transparent text-orange-200 border-2 border-orange-200 hover:text-orange-700 hover:bg-transparent'
            }`}
        >
            <PaperPlaneIcon className={`h-5 w-5 transition-colors duration-300
                ${isCurrentStepComplete
                ? 'text-orange-500 group-hover:text-orange-50'
                : 'text-orange-200 group-hover:text-orange-700'
            }`} />
            Next
        </Button>
    );
};

export default NextButton;