// app/auth/signup/page.tsx
'use client';

import { useState } from 'react';
import SignupForm from '@/components/form/SignupForm';
import LoginForm from '@/components/form/LoginForm';

export default function SignupPage() {
    const [showLoginModal, setShowLoginModal] = useState(false);

    const openLoginModal = () => setShowLoginModal(true);
    const closeLoginModal = () => setShowLoginModal(false);

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).id === 'modal-background') {
            closeLoginModal();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <SignupForm onOpenLoginModal={openLoginModal} />

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
}