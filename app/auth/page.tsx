// app/auth/page.tsx
"use client"

import React, { useState, useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { RadioCard } from '@/components/ui/radio-card';
import Flex from "@/components/ui/flex";
import Text from "@/components/ui/text";
import { SignupProvider } from "@/components/auth/SignupContext";
import SignupSection from '@/components/auth/SignupSection';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';

export default function AuthPage() {
    const [accountType, setAccountType] = useState<'Doctor' | 'Triage' | 'Admin' | 'Pending' | null>(null);
    const [authType, setAuthType] = useState<'Login' | 'Signup'>('Login');
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);

    const handleAuthTypeChange = (value: 'Login' | 'Signup') => {
        setAuthType(value);
        if (value === 'Signup') {
            setIsHeaderVisible(false);
        }
    };

    const toggleHeader = () => {
        setIsHeaderVisible(!isHeaderVisible);
    };

    useEffect(() => {
        const storedAccountType = localStorage.getItem('accountType') as 'Doctor' | 'Triage' | 'Admin' | 'Pending' | null;
        if (storedAccountType) {
            setAccountType(storedAccountType);
        }
    }, []);

    useEffect(() => {
        if (accountType) {
            setAuthType('Signup');
        }
    }, [accountType]);

    return (
        // Set pointer-events-none on the entire wrapper, to allow interaction with Nav and Footer
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
            {/* Only this section should be clickable */}
            <div className="relative w-full md:w-[40vw] h-[80vh] bg-white flex flex-col overflow-y-auto z-20 pointer-events-auto">
                {/* Header section */}
                <div
                    className={`transition-all duration-300 ease-in-out ${
                        isHeaderVisible ? 'h-16' : 'h-0 overflow-hidden'
                    }`}
                >
                    <div className="p-4 h-full">
                        <RadioCard.Root
                            value={authType}
                            onValueChange={handleAuthTypeChange}
                            className="flex w-full h-full"
                        >
                            <RadioCard.Item value="Login" className="w-1/2 p-2">
                                <Flex direction="column" width="100%" className="justify-center items-center h-full">
                                    <Text size="sm" weight="normal">Login</Text>
                                </Flex>
                            </RadioCard.Item>
                            <RadioCard.Item value="Signup" className="w-1/2 p-2">
                                <Flex direction="column" width="100%" className="justify-center items-center h-full">
                                    <Text size="sm" weight="normal">Sign Up</Text>
                                </Flex>
                            </RadioCard.Item>
                        </RadioCard.Root>
                    </div>
                </div>

                {/* Toggle button */}
                {authType === 'Signup' && (
                    <button
                        onClick={toggleHeader}
                        className="absolute top-2 left-1/2 transform -translate-x-1/2 z-30 bg-white rounded-full p-1 shadow-md"
                    >
                        {isHeaderVisible ? (
                            <ChevronUpIcon size={24} />
                        ) : (
                            <ChevronDownIcon size={24} />
                        )}
                    </button>
                )}

                {/* Content section */}
                <div className="flex-grow overflow-y-auto md:p-8 p-4">
                    {authType === 'Login' ? (
                        <div className="login-card w-full flex flex-col items-center justify-center">
                            <LoginForm />
                        </div>
                    ) : (
                        <SignupProvider>
                            <SignupSection />
                        </SignupProvider>
                    )}
                </div>
            </div>
        </div>
    );
}