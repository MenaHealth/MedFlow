import React, { useState, useEffect } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { jwtDecode } from "jwt-decode";

interface LinkGoogleAccountProps {
    isOpen: boolean;
    onClose: () => void;
    onLinkSuccess: (googleData: any) => void;
    onUnlinkSuccess: () => void;
    userId: string;
    googleId?: string;
    googleEmail?: string;
    googleImage?: string;
}

export function LinkGoogleAccount({
                                      isOpen,
                                      onClose,
                                      onLinkSuccess,
                                      onUnlinkSuccess,
                                      userId,
                                      googleId,
                                      googleEmail,
                                      googleImage,
                                  }: LinkGoogleAccountProps) {
    const [error, setError] = useState<string | null>(null);
    const isLinked = !!(googleId && googleEmail && googleImage);

    const handleGoogleSuccess = async (response: CredentialResponse) => {
        if (response.credential) {
            try {
                const googleProfile = jwtDecode(response.credential) as {
                    sub: string;
                    email: string;
                    picture: string;
                };

                const res = await fetch('/api/user/link-google', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        googleId: googleProfile.sub,
                        googleEmail: googleProfile.email,
                        googleImage: googleProfile.picture,
                    }),
                });

                if (res.ok) {
                    const updatedUser = await res.json();
                    onLinkSuccess(updatedUser);
                    onClose();
                } else {
                    const errorData = await res.json();
                    setError(errorData.error || 'Failed to link Google account.');
                }
            } catch (err) {
                console.error('Error linking Google account:', err);
                setError('Error linking Google account.');
            }
        } else {
            setError('Google login failed. Please try again.');
        }
    };

    const handleUnlink = async () => {
        try {
            const res = await fetch(`/api/user/unlink-google/${userId}`, {
                method: 'POST',
            });

            if (res.ok) {
                onUnlinkSuccess();
                onClose();
            } else {
                const errorData = await res.json();
                setError(errorData.error || 'Failed to unlink Google account.');
            }
        } catch (err) {
            console.error('Error unlinking Google account:', err);
            setError('Error unlinking Google account.');
        }
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose}>
            <DrawerContent direction="bottom" size="50%">
                <DrawerHeader>
                    <DrawerTitle>{isLinked ? 'Google Account Linked' : 'Link Google Account'}</DrawerTitle>
                    <DrawerDescription>
                        {isLinked
                            ? 'Your Google account is currently linked. You can unlink it here.'
                            : 'Connect your Google account to enable easy login in the future.'}
                    </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 flex flex-col items-center">
                    {isLinked ? (
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar src={googleImage} alt="Google Profile" className="w-16 h-16"/>
                            {googleEmail && <p className="text-sm text-gray-600">{googleEmail}</p>}
                            {googleId && (
                                <Button onClick={handleUnlink} variant="destructive">
                                    Unlink Google Account
                                </Button>
                            )}
                        </div>
                    ) : (
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google login failed. Please try again.')}
                        />
                    )}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
            </DrawerContent>
        </Drawer>
    );
}

