// app/auth/page.tsx
'use client';

import React, { useState } from 'react';
import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';
import './authPage.css';
import { RadioCard } from '@/components/ui/radio-card';
import Flex from "@/components/ui/flex";
import Text from "@/components/ui/text";

const AuthPage = () => {
    const [authType, setAuthType] = useState<'Login' | 'Signup'>('Login');
    const [accountType, setAccountType] = useState<'Doctor' | 'Triage'>('Doctor');

    const handleAccountTypeChange = (value: 'Doctor' | 'Triage') => {
        setAccountType(value);
    };

    // Determine the appropriate opacity classes based on the form state
    const heartRateOpacity = authType === 'Login' ? 'opacity-50' : accountType === 'Doctor' ? 'opacity-80' : 'opacity-20';
    const ballsOpacity = authType === 'Login' ? 'opacity-50' : accountType === 'Doctor' ? 'opacity-20' : 'opacity-80';

    return (
        <div className="h-screen p-4 bg-white flex flex-col items-center justify-center relative">
            <div className="absolute top-0 left-0 w-full h-full bg-transparent z-0">
                <section className="container top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="content">
                        <div className={`ball ball1 ${ballsOpacity}`}></div>
                        <div className={`ball ball2 ${ballsOpacity}`}></div>
                        <div className={`ball ball3 ${ballsOpacity}`}></div>
                        <div className={`ball ball4 ${ballsOpacity}`}></div>
                        <div className={`ball ball5 ${ballsOpacity}`}></div>
                        <div className="heart-rate">
                            <svg viewBox="0 9 498.778 54.805" className={`w-full h-full ${heartRateOpacity}`}>
                                <polyline fill="none" stroke="#FF5722" strokeWidth="2" strokeMiterlimit="10" points="0 45.486 64.133 45.486 74.259 33.324 84.385 45.486 96.2 45.486 104.637 55.622 119.825 9 133.327 63.729 140.079 45.486 162.018 45.486 172.146 40.419 183.958 45.486 249.778 45.486" />
                                <polyline fill="none" stroke="#FF5722" strokeWidth="2" strokeMiterlimit="10" points="249 45.562 313.133 45.562 323.259 33.4 333.385 45.562 345.2 45.562 353.637 55.698 368.825 9.076 382.327 63.805 389.079 45.562 411.018 45.562 421.146 40.495 432.958 45.562 498.778 45.562" />
                            </svg>
                            <div className="fade-in"></div>
                            <div className="fade-out"></div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="flex flex-col items-center justify-center w-full max-w-md">
                <RadioCard.Root
                    value={authType}
                    onValueChange={(value) => setAuthType(value as 'Login' | 'Signup')}
                    className="flex flex-col w-full mb-8"
                >
                    <RadioCard.Item value="Login" className="w-full mb-2 p-2">
                        <Flex direction="column" width="100%" className="justify-center items-center h-full">
                            <Text size="sm" weight="normal">Login</Text>
                        </Flex>
                    </RadioCard.Item>
                    <RadioCard.Item value="Signup" className="w-full p-2">
                        <Flex direction="column" width="100%" className="justify-center items-center h-full">
                            <Text size="sm" weight="normal">Sign Up</Text>
                        </Flex>
                    </RadioCard.Item>
                </RadioCard.Root>

                <div className="w-full">
                    {authType === 'Login' ? (
                        <div className="login-card w-full p-8 rounded-lg shadow-lg bg-white bg-opacity-10 backdrop-filter backdrop-blur-md">
                            <LoginForm />
                        </div>
                    ) : (
                        <div className="signup-card w-full p-8 rounded-lg shadow-lg bg-white bg-opacity-10 backdrop-filter backdrop-blur-md">
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
    );
};

export default AuthPage;