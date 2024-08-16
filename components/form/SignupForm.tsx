// components/form/SignupForm.tsx
'use client';

import { useState } from 'react';

interface SignupFormProps {
    onOpenLoginModal: () => void;
}

export default function SignupForm({ onOpenLoginModal }: SignupFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accountType, setAccountType] = useState('Patient');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Implement your signup logic here
            console.log('User data:', { name, email, password, accountType });
            setName('');
            setEmail('');
            setPassword('');
            setAccountType('Patient');
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
                <h1 className="text-2xl font-bold text-center mb-2">Sign Up</h1>
                <p className="text-center mb-4">Fill out the required information below to get started.</p>

                <div className="flex justify-center mb-4">
                    <button
                        className={`text-lg font-semibold ${accountType === 'Patient' ? 'underline text-[#FF5722]' : 'text-gray-600'}`}
                        onClick={() => setAccountType('Patient')}
                    >
                        Patient
                    </button>
                    <span className="mx-4">|</span>
                    <button
                        className={`text-lg font-semibold ${accountType === 'Surgeon' ? 'underline text-[#FF5722]' : 'text-gray-600'}`}
                        onClick={() => setAccountType('Surgeon')}
                    >
                        Doctor
                    </button>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div>
                        <label htmlFor="name" className="text-gray-700 font-bold">
                            Name:
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            required
                            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 w-full"
                        />
                    </div>
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
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-4 text-center">
                    Already Have an Account?{' '}
                    <span
                        onClick={onOpenLoginModal}
                        className="text-[#FF5722] cursor-pointer hover:underline"
                    >
                        Log in
                    </span>
                </p>
            </div>
        </div>
    );
}