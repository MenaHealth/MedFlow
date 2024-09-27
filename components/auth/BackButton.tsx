import React from 'react';
import { Button } from "@/components/ui/button";
import { UndoDot } from "lucide-react";
import { useSignupContext } from "@/components/auth/SignupContext";

const BackButton = () => {
    const { handleBack, currentStep } = useSignupContext();

    return (
        <Button
            onClick={handleBack}
            className={`group flex items-center justify-center px-4 py-2 rounded transition-all duration-300
                bg-gray-200 text-gray-800 shadow-lg shadow-gray-50 border-2 border-gray-200 hover:bg-gray-300 hover:text-gray-900 hover:shadow-gray-200
            `}
        >
            <UndoDot className="h-5 w-5 text-gray-800 group-hover:text-gray-900 transition-colors duration-300" />
        </Button>
    );
};

export default BackButton;