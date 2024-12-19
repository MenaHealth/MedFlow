// components/user-profile/UserProfileViewModel.ts
'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userProfileSchema = z.object({
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
    accountType: z.enum(['Doctor', 'Triage'], { errorMap: () => ({ message: "Account type is required" }) }),
    doctorSpecialty: z.string().optional(),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;

export function useUserProfileViewModel() {
    const { data: session, status } = useSession();
    const [myProfile, setMyProfile] = useState<UserProfileFormValues | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const methods = useForm<UserProfileFormValues>({
        resolver: zodResolver(userProfileSchema),
    });

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            fetch(`/api/user/${session.user?._id}`)
                .then(res => res.json())
                .then(data => {
                    setMyProfile(data);
                    methods.reset(data);
                });
        }
    }, [status, session?.user, methods]);

    const handleEdit = () => setIsEditing(true);

    const handleCancelEdit = () => {
        setIsEditing(false);
        methods.reset(myProfile || undefined);
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
                const updatedUser = await response.json();
                setMyProfile(updatedUser);
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
        if (myProfile) {
            navigator.clipboard.writeText(myProfile._id).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    };

    return {
        myProfile,
        isEditing,
        isLoading,
        isCopied,
        methods,
        handleEdit,
        handleCancelEdit,
        handleSubmit,
        copyToClipboard,
        status,
    };
}

