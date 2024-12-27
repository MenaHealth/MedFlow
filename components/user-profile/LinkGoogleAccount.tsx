// components/user-profile/LinkGoogleAccount.tsx

'use client'

import React, { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { X } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'

interface LinkGoogleAccountProps {
    isOpen: boolean
    onClose: () => void
    onLinkSuccess: (googleData: any) => void
    onUnlinkSuccess: () => void
    userId: string
    isLinked: boolean
    googleImage?: string
}

export function LinkGoogleAccount({
                                      isOpen,
                                      onClose,
                                      onLinkSuccess,
                                      onUnlinkSuccess,
                                      userId,
                                      isLinked,
                                      googleImage
                                  }: LinkGoogleAccountProps) {
    const [error, setError] = useState<string | null>(null)
    const { data: session, update } = useSession()

    const handleGoogleSuccess = async () => {
        try {
            const result = await signIn('google', { redirect: false });
            if (result?.error) {
                setError(result.error);
            } else {
                // Update the session to get the latest Google account information
                await update();

                if (session?.user) {
                    const response = await fetch('/api/user/link-google', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId,
                            googleId: session.user.googleId,
                            googleEmail: session.user.googleEmail,
                            googleImage: session.user.googleImage,
                        }),
                    });

                    if (response.ok) {
                        const updatedUser = await response.json();
                        onLinkSuccess(updatedUser);
                        onClose();
                    } else {
                        setError('Failed to link Google account.');
                    }
                } else {
                    setError('Failed to retrieve Google account information.');
                }
            }
        } catch (error) {
            console.error('Error linking Google account:', error);
            setError('Error linking Google account');
        }
    }

    const handleUnlinkGoogle = async () => {
        try {
            const response = await fetch(`/api/user/unlink-google/${userId}`, {
                method: 'POST',
            })
            if (response.ok) {
                onUnlinkSuccess()
                onClose()
            } else {
                setError('Failed to unlink Google account')
            }
        } catch (error) {
            console.error('Error unlinking Google account:', error)
            setError('Error unlinking Google account')
        }
    }

    return (
        <Drawer isOpen={isOpen} onClose={onClose}>
            <DrawerContent direction="bottom" size="50%">
                <DrawerHeader>
                    <DrawerTitle>{isLinked ? 'Google Account Linked' : 'Link Google Account'}</DrawerTitle>
                    <DrawerDescription>
                        {isLinked
                            ? 'Your Google account is currently linked. You can unlink it here.'
                            : 'Connect your Google account to enable easy login.'}
                    </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 flex flex-col items-center">
                    {isLinked ? (
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar src={googleImage} alt="Google Profile" className="w-16 h-16"/>
                            <Button onClick={handleUnlinkGoogle} variant="destructive">
                                Unlink Google Account
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={handleGoogleSuccess}>
                            Link Google Account
                        </Button>
                    )}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
            </DrawerContent>
        </Drawer>
    )
}

