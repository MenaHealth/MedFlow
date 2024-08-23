// app/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import LoginForm from '@/components/auth/LoginForm';

export default function HomePage() {
    const handleGoogleLogin = async () => {
        await signIn('google', { callbackUrl: '/dashboard' });
    };

    return (
        <div>
            <h1>Login</h1>
            <LoginForm />
            <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
    );
}



// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
//
// const HomePage = () => {
//     const router = useRouter();
//
//     useEffect(() => {
//         router.replace('/patient-info/dashboard');
//     }, [router]);
//
//     return null;
// };
//
// export default HomePage;
