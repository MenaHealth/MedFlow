// app/auth/page.tsx
'use client';

import React, { useState } from 'react';
import SignupForm from '@/components/auth/SignupForm';
import './authPage.css';
import { RadioCard } from '@/components/ui/radio-card';
import Box from '@/components/ui/box';
import Flex from "@/components/ui/flex"
import Text from "@/components/ui/text"

const AuthPage = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [accountType, setAccountType] = useState<'Doctor' | 'Triage'>('Doctor');

    const handleAccountTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccountType(event.target.value as 'Doctor' | 'Triage');
    };

    const openLoginModal = () => setShowLoginModal(true);
    const closeLoginModal = () => setShowLoginModal(false);

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).id === 'modal-background') {
            closeLoginModal();
        }
    };

    return (
        <div className="h-screen p-4 bg-white flex flex-col items-center justify-center relative">
            <div className="absolute top-0 left-0 w-full h-full bg-transparent z-0">
                <section className="container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="content">
                        <div className={`ball ball1 ${accountType === 'Doctor' ? 'opacity-20' : 'opacity-100'}`}></div>
                        <div className={`ball ball2 ${accountType === 'Doctor' ? 'opacity-20' : 'opacity-100'}`}></div>
                        <div className={`ball ball3 ${accountType === 'Doctor' ? 'opacity-20' : 'opacity-100'}`}></div>
                        <div className={`ball ball4 ${accountType === 'Doctor' ? 'opacity-20' : 'opacity-100'}`}></div>
                        <div className={`ball ball5 ${accountType === 'Doctor' ? 'opacity-20' : 'opacity-100'}`}></div>
                        <div className="heart-rate">
                        <svg viewBox="0 9 498.778 54.805" className={`w-full h-full ${accountType === 'Triage' ? 'opacity-20' : 'opacity-100'} ${showLoginModal ? 'blur-sm' : ''}`}>
                                <polyline fill="none" stroke="#FF5722" strokeWidth="2" strokeMiterlimit="10" points="0 45.486 64.133 45.486 74.259 33.324 84.385 45.486 96.2 45.486 104.637 55.622 119.825 9 133.327 63.729 140.079 45.486 162.018 45.486 172.146 40.419 183.958 45.486 249.778 45.486" />
                                <polyline fill="none" stroke="#FF5722" strokeWidth="2" strokeMiterlimit="10" points="249 45.562 313.133 45.562 323.259 33.4 333.385 45.562 345.2 45.562 353.637 55.698 368.825 9.076 382.327 63.805 389.079 45.562 411.018 45.562 421.146 40.495 432.958 45.562 498.778 45.562" />
                            </svg>
                            <div className="fade-in"></div>
                            <div className="fade-out"></div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="flex flex-col items-center justify-center">
                <div className="flex justify-center mb-8 w-full max-w-md">
                    <RadioCard.Root
                        value={accountType}
                        onValueChange={(value) => setAccountType(value as 'Doctor' | 'Triage')}
                        className="flex justify-between w-full"
                    >
                        <RadioCard.Item value="Doctor" className="w-1/2">
                            <Flex direction="column" width="100%" className="justify-center items-center h-full">
                                <Text size="sm" weight="medium">Doctor</Text>
                            </Flex>
                        </RadioCard.Item>
                        <RadioCard.Item value="Triage" className="w-1/2">
                            <Flex direction="column" width="100%" className="justify-center items-center h-full">
                                <Text size="sm" weight="medium">Triage Specialist</Text>
                            </Flex>
                        </RadioCard.Item>
                    </RadioCard.Root>
                </div>
                <div className="login-card w-full max-w-md p-8 rounded-lg shadow-lg bg-white bg-opacity-80 backdrop-filter backdrop-blur-md">
                    <SignupForm accountType={accountType} />
                </div>
            </div>
        </div>
    );
};

export default AuthPage;