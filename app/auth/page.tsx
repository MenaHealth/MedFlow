// app/auth/page.tsx
"use client"

import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { RadioCard } from '@/components/ui/radio-card';
import Flex from "@/components/ui/flex";
import Text from "@/components/ui/text";
import { SignupProvider } from "@/components/auth/SignupContext";
import SignupSection from "@/components/auth/SignupSection";
import { ChevronUpIcon } from 'lucide-react';

export default function AuthPage() {
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

    return (
        <div className="h-screen w-full p-4 flex flex-col items-center justify-center relative">
            <div className="w-[70vw] h-[70vh] bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative">
                <div
                    className={`transition-all duration-300 ease-in-out ${
                        isHeaderVisible ? 'h-16' : 'h-0 overflow-hidden'
                    }`}
                >
                    <div className="p-4 bg-gray-100 h-full">
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
                {!isHeaderVisible && (
                    <button
                        onClick={toggleHeader}
                        className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-full p-1 shadow-md"
                    >
                        <ChevronUpIcon size={24} />
                    </button>
                )}
                <div className={`flex-grow overflow-y-auto p-8 transition-all duration-300 ease-in-out ${
                    isHeaderVisible ? '' : 'pt-12'
                }`}>
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