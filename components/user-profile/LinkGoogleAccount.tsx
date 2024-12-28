import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import {jwtDecode} from "jwt-decode";

interface LinkGoogleAccountProps {
    isOpen: boolean;
    onClose: () => void;
    onLinkSuccess: (googleData: any) => void;
    onUnlinkSuccess: () => void;
    userId: string;
    isLinked: boolean;
    googleImage?: string;
}

export function LinkGoogleAccount({
                                      isOpen,
                                      onClose,
                                      onLinkSuccess,
                                      onUnlinkSuccess,
                                      userId,
                                      isLinked,
                                      googleImage,
                                  }: LinkGoogleAccountProps) {
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSuccess = async (response: CredentialResponse) => {
        if (response.credential) {
            try {
                // Decode the JWT to get Google profile info
                const googleProfile = jwtDecode(response.credential) as {
                    sub: string; // Google ID
                    email: string;
                    given_name: string;
                    family_name: string;
                    picture: string;
                };

                // Send Google profile data to the backend to link the account
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
                            <Avatar src={googleImage} alt="Google Profile" className="w-16 h-16" />
                            <Button onClick={onUnlinkSuccess} variant="destructive">
                                Unlink Google Account
                            </Button>
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