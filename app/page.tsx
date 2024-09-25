// app/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        console.log("HomePage - Session status:", status);
        console.log("HomePage - Session data:", session);

        if (status === 'loading') {
            return;
        }

        if (session) {
            console.log("Redirecting to dashboard");

            // Get the token from local storage
            const token = localStorage.getItem('token');

            // Redirect to the dashboard
            router.replace('/patient-info/dashboard');
        } else {
            console.log("Redirecting to auth");
            router.replace('/auth');
        }
    }, [router, session, status]);

    return null;
};

export default HomePage;