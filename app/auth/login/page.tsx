// app/auth/login/page.tsx
'use client';

import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <LoginForm />
        </div>
    );
}