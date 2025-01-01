// components/user-profile/UserProfileViewModel.ts
'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const userProfileSchema = z.object({
    _id: z.string(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string().refine((value) => {
        const date = new Date(value);
        return !isNaN(date.getTime()) && date < new Date();
    }, {
        message: "Please enter a valid date of birth in the past",
    }),
    languages: z.array(z.string()).min(1, "At least one language is required"),
    countries: z.array(z.string()).min(1, "At least one country is required"),
    gender: z.enum(['male', 'female'], { errorMap: () => ({ message: "Gender is required" }) }),
    image: z.string().optional(),
    email: z.string().optional(),
    accountType: z.enum(['Doctor', 'Triage', 'Evac'], { errorMap: () => ({ message: "Account type is required" }) }),
    doctorSpecialty: z.string().optional(),
    googleId: z.string().optional(),
    googleEmail: z.string().optional(),
    googleImage: z.string().optional(),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;

export interface UserProfileViewModel {
    profile: UserProfileFormValues | null;
    setProfile: (profile: UserProfileFormValues) => void; // Add this line
    isEditing: boolean;
    isLoading: boolean;
    isCopied: boolean;
    methods: UseFormReturn<UserProfileFormValues>;
    handleEdit: () => void;
    handleCancelEdit: () => void;
    handleSubmit: (data: UserProfileFormValues) => void;
    copyToClipboard: () => void;
    handleLinkGoogleAccount: () => void;
    handleUnlinkGoogleAccount: () => void;
    status: string;
    googleImage: string;
    googleEmail: string;
    googleId: string;
}

export function useUserProfileViewModel(): UserProfileViewModel {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<UserProfileFormValues | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const methods = useForm<UserProfileFormValues>({
        resolver: zodResolver(userProfileSchema),
    });

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            setIsLoading(true);
            fetch(`/api/user/${session.user._id}`)
                .then(res => res.json())
                .then(data => {
                    setProfile(data);
                    methods.reset(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching profile:', error);
                    setIsLoading(false);
                });
        }
    }, [status, session?.user, methods]);

    const handleEdit = () => setIsEditing(true);

    const handleCancelEdit = () => {
        setIsEditing(false);
        methods.reset(profile || undefined);
    };

    const handleSubmit = async (data: UserProfileFormValues) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/user/${data._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const updatedProfile = await response.json();
                setProfile(updatedProfile);
            } else {
                console.error('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
        setIsLoading(false);
        setIsEditing(false);
    };

    const copyToClipboard = () => {
        if (profile) {
            navigator.clipboard.writeText(profile._id).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    };

    const handleLinkGoogleAccount = async () => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/session');
            const session = await response.json();

            if (session?.user?.googleId) {
                const googleId = session.user.googleId;
                const googleEmail = session.user.googleEmail;
                const googleImage = session.user.googleImage;

                const patchResponse = await fetch(`/api/user/link-google/${profile?._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ googleId, googleEmail, googleImage }),
                });

                if (patchResponse.ok) {
                    const updatedProfile = await patchResponse.json();
                    setProfile(updatedProfile);
                    console.log('Google account linked successfully.');
                } else {
                    console.error('Failed to link Google account.');
                }
            } else {
                console.error('No Google profile available in the session.');
            }
        } catch (error) {
            console.error('Error linking Google account:', error);
        }

        setIsLoading(false);
    };

    const handleUnlinkGoogleAccount = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/user/unlink-google/${profile?._id}`, {
                method: 'POST', // Updated method to POST
            });
            if (response.ok) {
                const updatedProfile = await response.json();
                setProfile(updatedProfile);
                methods.reset(updatedProfile);
            } else {
                console.error('Failed to unlink Google account');
            }
        } catch (error) {
            console.error('Error unlinking Google account:', error);
        }
        setIsLoading(false);
    };

    return {
        profile,
        setProfile,
        isEditing,
        isLoading,
        isCopied,
        methods,
        handleEdit,
        handleCancelEdit,
        handleSubmit,
        copyToClipboard,
        handleLinkGoogleAccount,
        handleUnlinkGoogleAccount,
        status,
        googleImage: session?.user?.googleImage || '',
        googleEmail: session?.user?.googleEmail || '',
        googleId: session?.user?.googleId || '',
    };
}