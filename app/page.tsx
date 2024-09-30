'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

const HomePage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            const activeSession = session as Session;
            const userCompletedSignup = activeSession?.user?.accountType === 'Doctor' || activeSession?.user?.accountType === 'Triage';

            if (!userCompletedSignup) {
                router.replace('/complete-signup');
            } else {
                router.replace('/patient-info/dashboard');
            }
        }
    }, [router, session, status]);

    return null;
};

export default HomePage;