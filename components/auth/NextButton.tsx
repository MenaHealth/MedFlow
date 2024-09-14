import React from 'react';
import { Button } from "@/components/ui/button";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useSignupContext } from "@/components/auth/SignupContext";

const NextButton = () => {
    const { isFormComplete, currentStep, handleNext } = useSignupContext();

    const isCurrentStepComplete = isFormComplete[currentStep];

    return (
        <Button
            onClick={handleNext}
            disabled={!isCurrentStepComplete}
            className={`flex items-center justify-center px-4 py-2 rounded transition-all duration-300
                ${isCurrentStepComplete
                ? 'bg-orange text-white hover:bg-orange-600'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
        >
            <PaperPlaneIcon className="h-5 w-5 mr-2" />
            Next
        </Button>
    );
};

export default NextButton;