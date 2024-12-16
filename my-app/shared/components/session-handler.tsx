// components/session-handler.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';

// Define a type that matches your actual session user structure
interface CustomSessionUser {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    accountType: 'Doctor' | 'Triage' | 'Pending';
    isAdmin: boolean;
    image?: string;
    doctorSpecialty?: string;
    languages?: string[];
    token?: string;
    gender?: 'male' | 'female';
    dob?: string;
}

export default function SessionHandler() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [userSession, setUserSession] = useState<CustomSessionUser | null>(null);

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            // Cast the session user to CustomSessionUser
            setUserSession(session.user as unknown as CustomSessionUser);
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