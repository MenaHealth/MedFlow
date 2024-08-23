// app/auth/auth/page.tsx
'use client';

import { useState } from 'react';
import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';

export default function SignupPage() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);

    const openLoginModal = () => {
        setSignupSuccess(false); // Close success message before showing the login modal
        setShowLoginModal(true);
    };

    const closeLoginModal = () => {
        setShowLoginModal(false);
    };

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).id === 'modal-background') {
            closeLoginModal();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <SignupForm onOpenLoginModal={() => setSignupSuccess(true)} />

            {/* Success Modal */}
            {signupSuccess && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="relative bg-white p-6 rounded shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-center">Patient account created successfully!</h2>
                        <p className="mb-6 text-center">You can now log in using your credentials.</p>
                        <div className="flex justify-center">
                            <button
                                onClick={openLoginModal}
                                className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Log In
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Login Modal */}
            {showLoginModal && (
                <div
                    id="modal-background"
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
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
}