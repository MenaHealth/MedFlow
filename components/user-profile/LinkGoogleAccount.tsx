// components/user-profile/LinkGoogleAccount.tsx

'use client'

import React, { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { X } from 'lucide-react'

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

    const handleGoogleSuccess = async (credentialResponse: any) => {
        if (credentialResponse.credential) {
            try {
                const decoded: any = jwtDecode(credentialResponse.credential)
                const { sub, email, picture, name } = decoded

                const response = await fetch('/api/user/link-google', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        name: name || '',
                        email: email || '',
                        googleId: sub,
                        googleEmail: email,
                        googleImage: picture,
                    }),
                })

                if (response.ok) {
                    const updatedUser = await response.json()
                    onLinkSuccess(updatedUser)
                    onClose()
                } else {
                    setError('Failed to link Google account.')
                }
            } catch (error) {
                console.error('Error decoding Google credential:', error)
                setError('Error decoding Google credential')
            }
        } else {
            setError('No credential received from Google.')
        }
    }

    const handleGoogleError = () => {
        setError('Google login failed')
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
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            useOneTap
                        />
                    )}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
            </DrawerContent>
        </Drawer>
    )
}

