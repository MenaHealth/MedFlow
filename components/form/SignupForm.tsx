// components/form/SignupForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BarLoader from 'react-spinners/BarLoader';

interface SignupFormProps {
    onOpenLoginModal: () => void;
}

export default function SignupForm({ onOpenLoginModal }: SignupFormProps) {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [accountType, setAccountType] = useState<'Patient' | 'Doctor'>('Patient');
    const [error, setError] = useState<string | null>(null);
    const [emailTouched, setEmailTouched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (password !== verifyPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters long and include at least one symbol.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/signup/patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'An error occurred during signup.');
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            console.log('Response data:', data);

            const patientId = data.patientId;

            if (!patientId) {
                throw new Error('Failed to retrieve patient ID.');
            }

            await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    accountType: 'Patient',
                }),
            });

            router.push(`/create-patient/${patientId}`);
        } catch (error: any) {
            setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {isLoading && (
                <BarLoader color="#FF5722" width={100} />
            )}
            {!isLoading && (
                <>
                    <h1 className="text-2xl font-bold text-center mb-2">Sign Up</h1>
                    <p className="text-center mb-4">Fill out the required information below to get started.</p>

                    {/* Account Type Selection */}
                    <div className="flex justify-center mb-4">
                        <button
                            className={`text-lg font-semibold ${accountType === 'Patient' ? 'underline text-[#FF5722]' : 'text-gray-600'}`}
                            onClick={() => setAccountType('Patient')}
                        >
                            Patient
                        </button>
                        <span className="mx-4">|</span>
                        <button
                            className={`text-lg font-semibold ${accountType === 'Doctor' ? 'underline text-[#FF5722]' : 'text-gray-600'}`}
                            onClick={() => setAccountType('Doctor')}
                        >
                            Doctor
                        </button>
                    </div>

                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <div>
                            <label htmlFor="firstName" className="text-gray-700 font-bold">
                                {accountType === 'Patient' ? 'First Name:' : 'Name:'}
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="text-gray-700 font-bold">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setEmailTouched(true)}
                                required
                                className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 w-full"
                            />
                            {emailTouched && !emailRegex.test(email) && (
                                <p className="text-red-500 text-sm mt-1">Please enter a valid email address.</p>
                            )}
                        </div>

                        {firstName && emailRegex.test(email) && (
                            <>
                                <div>
                                    <label htmlFor="password" className="text-gray-700 font-bold">
                                        Password:
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 w-full"
                                    />
                                    <p className="text-gray-500 text-sm mt-1">
                                        Password must be at least 8 characters long and include at least one symbol.
                                    </p>
                                </div>

                                {password.length >= 8 && (
                                    <div>
                                        <label htmlFor="verify-password" className="text-gray-700 font-bold">
                                            Verify Password:
                                        </label>
                                        <input
                                            type="password"
                                            id="verify-password"
                                            value={verifyPassword}
                                            onChange={(e) => setVerifyPassword(e.target.value)}
                                            required
                                            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 w-full"
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        <button
                            type="submit"
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            Sign Up
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}