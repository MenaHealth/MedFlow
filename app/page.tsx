'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (session) {
            router.replace('/patient-info/dashboard');
        } else {
            router.replace('/auth');
        }
    }, [router, session, status]);

    return null;
};

export default HomePage;