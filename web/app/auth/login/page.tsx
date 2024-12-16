// app/auth/login/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import ResetPasswordView from '@/components/form/forgotPassword/ResetPasswordView';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';

export default function LoginPage() {
    const searchParams = useSearchParams();
    const resetCode = searchParams ? searchParams.get('code') : null;
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (resetCode) {
            setIsOpen(true);
        }
    }, [resetCode]);

    const closeDrawer = () => {
        setIsOpen(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <LoginForm />
            <Drawer
                isOpen={isOpen}
                onClose={closeDrawer}
            >
                <DrawerContent
                    direction="bottom"
                    size="70%"
                    title="Reset Password"
                >
                    <DrawerHeader>
                        <DrawerDescription>Enter your new password below.</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">
                        {resetCode && <ResetPasswordView code={resetCode} onSuccess={closeDrawer} />}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}