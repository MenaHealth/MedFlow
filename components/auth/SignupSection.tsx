import React from 'react';
import { useSignupContext } from './SignupContext';
import UserTypeForm from './UserTypeForm';
import PasswordEmailForm from './PasswordEmailForm';
import SecurityQuestionsForm from './SecurityQuestionsForm';
import DoctorSignupForm from './DoctorSignupForm';
import TriageSignupForm from './TriageSignupForm';
import NextButton from '@/components/auth/NextButton';
import Submit from '@/components/auth/Submit';
import ProgressBar from './progressBar';
import BackButton from "@/components/auth/BackButton";

const SignupSection = () => {
    const { currentStep, accountType, handleBack, progress } = useSignupContext();

    const renderForm = () => {
        switch (currentStep) {
            case 0:
                return <UserTypeForm />;
            case 1:
                return <PasswordEmailForm />;
            case 2:
                return <SecurityQuestionsForm />;
            case 3:
                return accountType === "Doctor" ? <DoctorSignupForm /> : <TriageSignupForm />;
            default:
                return null;
        }
    };

    const renderButton = () => {
        if (currentStep === 3) {
            return <Submit />;
        }
        return <NextButton />;
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="p-4">
                <ProgressBar progress={progress} />
            </div>
            <div className="flex-grow overflow-y-auto w-full">
                {renderForm()}
            </div>
            <div className="p-4 bg-white border-t relative overflow-visible h-auto w-full"> {/* Full width buttons section */}
                {currentStep > 0 && (
                    <div className="absolute left-0">
                        <BackButton />
                    </div>
                )}

                <div className="flex justify-center">
                    {renderButton()}
                </div>
            </div>
        </div>
    );
};

export default SignupSection;