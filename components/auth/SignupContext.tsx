import { createContext, useState, useContext, useCallback } from 'react';

interface SignupContextValue {
    formData: {
        email?: string;
        password?: string;
        confirmPassword?: string;
        question1?: string;
        answer1?: string;
        question2?: string;
        answer2?: string;
        question3?: string;
        answer3?: string;
        firstName?: string;
        lastName?: string;
        dob?: string;
        doctorSpecialty?: string[];
        languages?: string[];
        countries?: string[];
        gender?: 'male' | 'female';
    };
    setFormData: (data: any) => void;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    progress: number;
    setProgress: (progress: number) => void;
    handleNext: () => void;
    handleBack: () => void;
    isFormComplete: boolean[];
    setIsFormComplete: (complete: boolean) => void;
    accountType: 'Doctor' | 'Triage' | null;
    setAccountType: (accountType: 'Doctor' | 'Triage') => void;
}

const SignupContext = createContext<SignupContextValue | null>(null);

export const useSignupContext = () => {
    const context = useContext(SignupContext);
    if (!context) {
        throw new Error('useSignupContext must be used within a SignupProvider');
    }
    return context;
};

export const SignupProvider = ({ children, initialAccountType }: { children: React.ReactNode, initialAccountType: 'Doctor' | 'Triage' }) => {
    const [formData, setFormData] = useState<SignupContextValue['formData']>({});
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isFormComplete, setIsFormComplete] = useState([false, false, false, false]);
    const [accountType, setAccountType] = useState(initialAccountType);

    const handleNext = useCallback(() => {
        if (isFormComplete[currentStep]) {
            if (currentStep === 3) {
                return;
            }
            setCurrentStep((prev) => prev + 1);
            setProgress((prev) => Math.min(1, prev + 0.25));
        }
    }, [currentStep, isFormComplete]);

    const handleBack = useCallback(() => {
        setCurrentStep((prev) => Math.max(0, prev - 1));
        setProgress((prev) => Math.max(0, prev - 0.25));
    }, []);

    const updateIsFormComplete = useCallback((complete: boolean) => {
        setIsFormComplete((prev) => {
            const newIsFormComplete = [...prev];
            newIsFormComplete[currentStep] = complete;
            return newIsFormComplete;
        });
    }, [currentStep]);

    return (
        <SignupContext.Provider value={{
            formData,
            setFormData,
            currentStep,
            setCurrentStep,
            progress,
            setProgress,
            isFormComplete,
            setIsFormComplete: updateIsFormComplete,
            handleNext,
            handleBack,
            accountType,
            setAccountType,
        }}>
            {children}
        </SignupContext.Provider>
    );
};

export { SignupContext };