import React from 'react';
import { useSignupContext } from './SignupContext';
import UserTypeForm from './UserTypeForm';
import PasswordEmailForm from './PasswordEmailForm';
import SecurityQuestionsForm from './SecurityQuestionsForm';
import DoctorSignupForm from './DoctorSignupForm';
import TriageSignupForm from './TriageSignupForm';
import NextButton from '@/components/auth/NextButton';
import Submit from '@/components/auth/Submit';
import ProgressBar from './ProgressBar';

const SignupSection = () => {
    const {
        currentStep,
        accountType,
        handleBack,
        progress,
    } = useSignupContext();

    const renderForm = () => {
        switch (currentStep) {
            case 0:
                return <UserTypeForm />;
            case 1:
                return <PasswordEmailForm />;
            case 2:
                return <SecurityQuestionsForm />;
            case 3:
                return accountType === 'Doctor' ? <DoctorSignupForm /> : <TriageSignupForm />;
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
            <div className="flex-grow overflow-y-auto">
                {renderForm()}
            </div>
            <div className="p-4 bg-white border-t flex justify-between">
                {renderButton()}
                {currentStep > 0 && (
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    >
                        Back
                    </button>
                )}
            </div>
        </div>
    );
};

export default SignupSection;