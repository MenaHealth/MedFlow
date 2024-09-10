// app/page.tsx
'use client';
import { useSession } from 'next-auth/react';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.replace('/patient-info/dashboard');
        } else {
            router.replace('/auth');
        }
    }, [router, session]);

    return null;
};

export default HomePage;