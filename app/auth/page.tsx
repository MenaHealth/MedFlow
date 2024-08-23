// app/auth/page.tsx
'use client';

import React, { useState } from 'react';
import DoctorSignupForm from '@/components/auth/DoctorSignupForm';
import LoginForm from '@/components/auth/LoginForm';
import './authPage.css';

const AuthPage = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);

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
                        <div className="heart-rate w-full h-full">
                            {/* Your SVG Heartbeat Monitor */}
                            <svg viewBox="0 9 498.778 54.805" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full opacity-100 ${showLoginModal ? 'blur-sm' : ''}`}>
                                <polyline fill="none" stroke="#FF5722" strokeWidth="2" strokeMiterlimit="10" points="0 45.486 64.133 45.486 74.259 33.324 84.385 45.486 96.2 45.486 104.637 55.622 119.825 9 133.327 63.729 140.079 45.486 162.018 45.486 172.146 40.419 183.958 45.486 249.778 45.486" />
                                <polyline fill="none" stroke="#FF5722" strokeWidth="2" strokeMiterlimit="10" points="249 45.562 313.133 45.562 323.259 33.4 333.385 45.562 345.2 45.562 353.637 55.698 368.825 9.076 382.327 63.805 389.079 45.562 411.018 45.562 421.146 40.495 432.958 45.562 498.778 45.562" />
                            </svg>

                            <div className="fade-in"></div>
                            <div className="fade-out"></div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="w-full max-w-md p-6 rounded shadow-md relative z-10 bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg">
                <DoctorSignupForm />
            </div>

            {/* Login Modal */}
            {showLoginModal && (
                <div
                    id="modal-background"
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={handleOutsideClick}
                >
                    <div className="relative bg-white p-6 rounded shadow-md">
                        <button
                            onClick={closeLoginModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                        >
                            ✕
                        </button>
                        <LoginForm />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthPage;