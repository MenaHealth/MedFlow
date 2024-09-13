// app/auth/page.tsx
"use client"

import React, { useState } from 'react';
import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { RadioCard } from '@/components/ui/radio-card';
import Flex from "@/components/ui/flex";
import Text from "@/components/ui/text";
import Card from '@/components/ui/card';

const AuthPage = () => {
    const [authType, setAuthType] = useState<'Login' | 'Signup'>('Login');
    const [accountType, setAccountType] = useState<'Doctor' | 'Triage'>('Doctor');
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleAccountTypeChange = (value: 'Doctor' | 'Triage') => {
        setAccountType(value);
    };

    return (
        <div className="h-screen w-full p-4 flex flex-col items-center justify-center relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-transparent z-0">
            </div>

            {/* Auth container */}
            <div className="fixed inset-0 flex items-center justify-center z-10">
                <div className="w-[70vw] h-[70vh] bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                    {/* Auth type selector */}
                    <div className="p-4 bg-gray-100">
                        <RadioCard.Root
                            value={authType}
                            onValueChange={(value) => setAuthType(value as 'Login' | 'Signup')}
                            className="flex w-full"
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

                    {/* Form content */}
                    <div className="flex-grow overflow-y-auto p-8">
                        {authType === 'Login' ? (
                            <div className="login-card w-full flex flex-col items-center justify-center">
                                <LoginForm />
                            </div>
                        ) : (
                            <div className="signup-card w-full">
                                <div className="mb-8">
                                    <RadioCard.Root
                                        value={accountType}
                                        onValueChange={handleAccountTypeChange}
                                        className="flex justify-between w-full"
                                    >
                                        <RadioCard.Item value="Doctor" className="w-1/2 p-2">
                                            <Flex direction="column" width="100%" className="justify-center items-center h-full">
                                                <Text size="sm" weight="normal">Doctor</Text>
                                            </Flex>
                                        </RadioCard.Item>
                                        <RadioCard.Item value="Triage" className="w-1/2 p-2">
                                            <Flex direction="column" width="100%" className="justify-center items-center h-full">
                                                <Text size="sm" weight="normal">Triage Specialist</Text>
                                            </Flex>
                                        </RadioCard.Item>
                                    </RadioCard.Root>
                                </div>
                                <SignupForm accountType={accountType} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;