import React from 'react';
import { Button } from "@/components/ui/button";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

interface NextButtonProps {
    onClick: () => void;
    isDisabled: boolean;
}

const NextButton: React.FC<NextButtonProps> = ({ onClick, isDisabled }) => {
    return (
        <Button
            onClick={onClick}
            disabled={isDisabled}
            className={`flex items-center justify-center px-4 py-2 rounded transition-all duration-300
                ${isDisabled
                ? 'bg-gray-300 text-gray-600'
                : 'bg-white hover:bg-orange text-orange hover:text-white shadow-[0_4px_6px_rgba(234,88,12,0.5)] hover:shadow-[0_4px_6px_rgba(234,88,12,0.8)]'
            }`}
        >
            <PaperPlaneIcon className="h-5 w-5" />
        </Button>
    );
};

export default NextButton;