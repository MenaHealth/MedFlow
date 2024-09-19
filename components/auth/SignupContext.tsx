import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';

interface FormData {
    accountType?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    securityQuestions?: { question: string; answer: string }[];
    firstName?: string;
    lastName?: string;
    doctorType?: string;
    language?: string;
    gender?: string;
    location?: string;
}

interface SignupContextValue {
    // next/back button, progress bar, and form completion
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    progress: number;
    updateProgress: () => void;
    handleNext: () => void;
    handleBack: () => void;
    answeredQuestions: number;
    setAnsweredQuestions: (count: number) => void;
    updateAnsweredQuestions: (step: number, count: number) => void;
    stepAnswers: number[];
    // userTypeForm
    accountType: 'Doctor' | 'Triage' | null;
    setAccountType: (accountType: 'Doctor' | 'Triage') => void;
    //PasswordEmailForm
    validEmail: boolean;
    setValidEmail: React.Dispatch<React.SetStateAction<boolean>>;
    passwordsMatch: boolean;
    setPasswordsMatch: React.Dispatch<React.SetStateAction<boolean>>;
    // SecurityQuestionsForm
    securityQuestionFormCompleted: boolean;
    setSecurityQuestionFormCompleted: React.Dispatch<React.SetStateAction<boolean>>;

}

const SignupContext = createContext<SignupContextValue | null>(null);

export const useSignupContext = () => {
    const context = useContext(SignupContext);
    if (!context) {
        throw new Error('useSignupContext must be used within a SignupProvider');
    }
    console.log('useSignupContext: ', context);
    return context;
};

export const SignupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState<FormData>({});
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [accountType, setAccountType] = useState<'Doctor' | 'Triage' | null>(null);
    const [answeredQuestions, setAnsweredQuestions] = useState(0);
    const [stepAnswers, setStepAnswers] = useState<number[]>(new Array(4).fill(0));
    // step 1: user type selection, step 2: email password, step 3: security questions, step 4: doctor / triage sign up
    const [validEmail, setValidEmail] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [securityQuestionFormCompleted, setSecurityQuestionFormCompleted] = useState(false);

    const totalQuestions = useMemo(() => {
        return accountType === 'Doctor' ? 14 : 12;
    }, [accountType]);

    const updateProgress = useCallback(() => {
        console.log('Updating progress...');
        const newProgress = (answeredQuestions / totalQuestions) * 100;
        console.log('New progress calculated:', newProgress, 'Answered:', answeredQuestions, 'Total:', totalQuestions);
        setProgress(newProgress);
    }, [answeredQuestions, totalQuestions]);

    const updateAnsweredQuestions = useCallback((step: number, count: number) => {
        if (count < 0) {
            console.error("Invalid count value. Count cannot be less than 0.");
            return;
        }
        setStepAnswers(prev => {
            const newStepAnswers = [...prev];
            newStepAnswers[step] = count;
            const newTotal = newStepAnswers.reduce((acc, curr) => acc + curr, 0);
            setAnsweredQuestions(newTotal);
            console.log('Updated stepAnswers:', newStepAnswers);
            console.log('Updated answeredQuestions:', newTotal);
            return newStepAnswers;
        });
    }, []);

    useEffect(() => {
        if (currentStep === 0 && answeredQuestions === 0) {
        }
    }, [currentStep, answeredQuestions]);

    useEffect(() => {
        console.log('SignupContext: ');
        console.log('currentStep: ', currentStep);
        console.log('stepAnswers: ', stepAnswers);
        console.log('answeredQuestions: ', answeredQuestions);
        updateProgress(); // this is the function that calculates and sets the progress

        // You could also log the progress directly after calling updateProgress:
        console.log('Updated Progress:', (answeredQuestions / totalQuestions) * 100);
    }, [answeredQuestions, totalQuestions, updateProgress]);

    const handleNext = useCallback(() => {
        if (currentStep < 3) {
            setCurrentStep((prev) => prev + 1);
        }
    }, [currentStep]);

    const handleBack = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    }, [currentStep]);

    return (
        <SignupContext.Provider
            value={{
                formData,
                setFormData,
                currentStep,
                setCurrentStep,
                progress,
                updateProgress,
                handleNext,
                handleBack,
                answeredQuestions,
                setAnsweredQuestions,
                updateAnsweredQuestions,
                stepAnswers,

                accountType,
                setAccountType,
                validEmail,
                setValidEmail,
                passwordsMatch,
                setPasswordsMatch,
                securityQuestionFormCompleted,
                setSecurityQuestionFormCompleted,
            }}
        >
            {children}
        </SignupContext.Provider>
    );
};

export { SignupContext };