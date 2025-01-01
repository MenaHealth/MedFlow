// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import type {} from './../types/next-auth'; // This import is just to ensure the module augmentation is loaded

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
            const userAccountType = userSession.accountType as "Doctor" | "Triage" | "Evac" | "Pending" | undefined;
    
            if (userAccountType === "Pending") {
                router.replace("/complete-signup");
            } else if (userAccountType === "Doctor" || userAccountType === "Triage" || userAccountType === "Evac") {
                router.replace("/patient-info/dashboard");
            } else {
                router.replace("/complete-signup");
            }
        }
    }, [router, userSession]);    

    return null;
}