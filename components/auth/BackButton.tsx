import React from 'react';
import { Button } from "@/components/ui/button";
import { UndoDot } from "lucide-react";
import { useSignupContext } from "@/components/auth/SignupContext";

const BackButton = () => {
    const { handleBack, currentStep } = useSignupContext();

    return (
        <Button
            onClick={handleBack}
            className={`group flex items-center justify-center px-4 py-2 rounded`}
            variant="outline"
        >
            <UndoDot className="h-5 w-5" />
        </Button>
    );
};

export default BackButton;