import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';

interface FormData {
    accountType?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    securityQuestions?: { question: string; answer: string }[];
    firstName?: string;
    lastName?: string;
    dob?: string;
    doctorSpecialty?: string;
    languages?: string[];
    gender?: 'male' | 'female' | undefined;
    countries?: string[];
    question1?: string;
    answer1?: string;
    question2?: string;
    answer2?: string;
    question3?: string;
    answer3?: string;
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
    accountType: 'Doctor' | 'Triage' | 'Admin' | 'Pending' | null;
    setAccountType: (accountType: 'Doctor' | 'Triage' | 'Admin' | 'Pending' | null) => void;
    //PasswordEmailForm
    validEmail: boolean;
    setValidEmail: React.Dispatch<React.SetStateAction<boolean>>;
    emailExists: boolean;
    setEmailExists: React.Dispatch<React.SetStateAction<boolean>>;
    passwordsMatch: boolean;
    setPasswordsMatch: React.Dispatch<React.SetStateAction<boolean>>;
    // SecurityQuestionsForm
    securityQuestionFormCompleted: boolean;
    setSecurityQuestionFormCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    // DoctorSignupForm
    doctorSignupFormCompleted: boolean;
    setDoctorSignupFormCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    // TriageSignupForm
    triageSignupFormCompleted: boolean;
    setTriageSignupFormCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupContext = createContext<SignupContextValue | null>(null);

export const useSignupContext = () => {
    const context = useContext(SignupContext);
    if (!context) {
        throw new Error('useSignupContext must be used within a SignupProvider');
    }
    return context;
};

export const SignupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState<FormData>({});
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(2);
    const [accountType, setAccountType] = useState<'Doctor' | 'Triage' | 'Admin' | 'Pending' | null>(null);
    const [answeredQuestions, setAnsweredQuestions] = useState(0);
    const [stepAnswers, setStepAnswers] = useState<number[]>(new Array(4).fill(0));
    // step 1: user type selection, step 2: email password, step 3: security questions, step 4: doctor / triage sign up
    const [validEmail, setValidEmail] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [securityQuestionFormCompleted, setSecurityQuestionFormCompleted] = useState(false);
    const [doctorSignupFormCompleted, setDoctorSignupFormCompleted] = useState(false);
    const [triageSignupFormCompleted, setTriageSignupFormCompleted] = useState(false);
    const totalQuestions = useMemo(() => {
        console.log('Calculating total questions for account type:', accountType);
        return accountType === 'Doctor' ? 17 : 13;
    }, [accountType]);

    const updateProgress = useCallback(() => {
        const newProgress = answeredQuestions ?((answeredQuestions / totalQuestions) * 100) : 2;
        console.log(`Answered Questions: ${answeredQuestions}, Total Questions: ${totalQuestions}, New Progress: ${newProgress}%`); // Log for debugging
        setProgress(newProgress);
    }, [answeredQuestions, totalQuestions]);

    const updateAnsweredQuestions = useCallback((step: number, count: number) => {
        if (count < 0 || step >= stepAnswers.length) {
            console.warn(`Invalid step: ${step} or count: ${count}`);
            return;
        }

        // Check if we actually need to update
        setStepAnswers((prev) => {
            if (prev[step] === count) {
                // If there's no change, don't update state
                return prev;
            }

            const newStepAnswers = [...prev];
            newStepAnswers[step] = count;

            // Calculate total answered questions
            const newTotal = newStepAnswers.reduce((acc, curr) => acc + (curr || 0), 0); // Prevent NaN by ensuring 0 for undefined values
            console.log(`Step: ${step}, Answered count: ${count}, Total answered questions: ${newTotal}`);
            setAnsweredQuestions(newTotal);
            return newStepAnswers;
        });
    }, [stepAnswers]);

    useEffect(() => {
        if (currentStep === 0 && answeredQuestions === 0) {
        }
    }, [currentStep, answeredQuestions]);

    useEffect(() => {
        console.log('Updating progress based on answered questions or total questions');
        updateProgress();
    }, [answeredQuestions, totalQuestions, updateProgress]);

    const handleNext = useCallback(() => {
        if (currentStep === 1 && emailExists) {
            return;
        }
        if (currentStep < 3) {
            setCurrentStep((prev) => prev + 1);
        }
    }, [currentStep, emailExists]);

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
                emailExists,
                setEmailExists,
                passwordsMatch,
                setPasswordsMatch,
                securityQuestionFormCompleted,
                setSecurityQuestionFormCompleted,
                doctorSignupFormCompleted,
                setDoctorSignupFormCompleted,
                triageSignupFormCompleted,
                setTriageSignupFormCompleted,
            }}
        >
            {children}
        </SignupContext.Provider>
    );
};

export { SignupContext };