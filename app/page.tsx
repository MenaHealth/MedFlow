// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/auth');
    }, [router]);

    return null;
};

export default HomePage;