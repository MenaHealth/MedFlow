// app/auth/page.tsx
'use client';

import React, { useState } from 'react';
import SignupForm from '../../components/form/SignupForm';
import LoginForm from '../../components/form/LoginForm';

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
        <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
                <SignupForm onOpenLoginModal={openLoginModal} />
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