// app/auth/page.tsx
"use client"

import React, { useState } from 'react';
import PasswordEmailForm from '@/components/auth/PasswordEmailForm';
import LoginForm from '@/components/auth/LoginForm';
import { RadioCard } from '@/components/ui/radio-card';
import Flex from "@/components/ui/flex";
import Text from "@/components/ui/text";
import { SignupProvider } from "@/components/auth/SignupContext";
import SignupSection from "@/components/auth/SignupSection";

const AuthPage = () => {
    const [authType, setAuthType] = useState<'Login' | 'Signup'>('Login');
    const [accountType, setAccountType] = useState<'Doctor' | 'Triage'>('Doctor');

    return (
        <div className="h-screen w-full p-4 flex flex-col items-center justify-center relative">
            <div className="fixed inset-0 flex items-center justify-center z-10">
                <div className="w-[70vw] h-[70vh] bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
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
                    <div className="flex-grow overflow-y-auto p-8">
                        {authType === 'Login' ? (
                            <div className="login-card w-full flex flex-col items-center justify-center">
                                <LoginForm />
                            </div>
                        ) : (
                            <SignupProvider initialAccountType={accountType}>
                                <SignupSection />
                            </SignupProvider>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;