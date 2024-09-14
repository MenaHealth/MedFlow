'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

interface CustomSession extends Session {
    user: {
        id?: string;
        email?: string | null;
        name?: string | null;
        image?: string | null;
        accountType?: 'Doctor' | 'Triage' | 'Admin' | 'Pending';
    };
}

const HomePage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            const customSession = session as CustomSession;
            const userCompletedSignup = customSession?.user?.accountType && customSession?.user?.accountType !== 'Pending';

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
