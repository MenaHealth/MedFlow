// components/form/LoginForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accountType, setAccountType] = useState<'Patient' | 'Doctor'>('Patient'); // Define accountType state
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
            accountType, // Pass accountType to the signIn call
        });

        if (result?.error) {
            setError(result.error);
        } else {
            console.log('Logged in successfully');
            window.location.href = '/create-patient';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
                <h1 className="text-2xl font-bold text-center mb-2">Login</h1>
                <p className="text-center mb-4">Please enter your credentials to log in.</p>

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
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}