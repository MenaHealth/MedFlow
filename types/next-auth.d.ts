'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';

export default function Component() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [userSession, setUserSession] = useState<Session['user'] | null>(null);

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            setUserSession(session.user);
        }
    }, [session, status]);

    useEffect(() => {
        if (userSession) {
            const userAccountType = userSession.accountType;

            if (userAccountType === 'Pending') {
                router.replace('/complete-signup');
            } else if (userAccountType === 'Doctor' || userAccountType === 'Triage') {
                router.replace('/patient-info/dashboard');
            } else {
                router.replace('/complete-signup');
            }
        }
    }, [router, userSession]);

    return null;
}