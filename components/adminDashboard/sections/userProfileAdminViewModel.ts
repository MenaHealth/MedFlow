// components/adminDashboard/sections/userProfileAdminViewModel.ts

import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { UserProfileFormValues, userProfileSchema, UserProfileViewModel } from "@/components/user-profile/UserProfileViewModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useToast } from '@/components/hooks/useToast';

export function useUserProfileAdminViewModel(userId?: string): UserProfileViewModel {
    const { data: session } = useSession();
    const { setToast } = useToast();
    const methods = useForm<UserProfileFormValues>({
        resolver: zodResolver(userProfileSchema),
    });
    const [profile, setProfile] = useState<UserProfileFormValues | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [status, setStatus] = useState<string>('loading');

    useEffect(() => {
        if (userId) {
            setIsLoading(true);
            setStatus('loading');
            fetch(`/api/admin/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${session?.user.token}`,
                }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch user');
                    }
                    return res.json();
                })
                .then(data => {
                    setProfile(data);
                    methods.reset(data);
                    setIsLoading(false);
                    setStatus('authenticated');
                })
                .catch(error => {
                    console.error('Error fetching user:', error);
                    setIsLoading(false);
                    setStatus('error');
                });
        } else {
            setStatus('unauthenticated');
        }
    }, [userId, methods, session?.user.token]);

    const handleEdit = () => setIsEditing(true);

    const handleCancelEdit = () => {
        setIsEditing(false);
        methods.reset(profile || undefined);
    };

    const handleSubmit = async (data: UserProfileFormValues) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/user/${data._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user.token}`,
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const updatedProfile = await response.json();
                setProfile(updatedProfile);
                setToast({
                    title: 'Success',
                    description: 'User updated successfully.',
                    variant: 'default',
                });
                setIsEditing(false);
            } else {
                const errorData = await response.json();
                setToast({
                    title: 'Error',
                    description: errorData.message || 'Failed to update user.',
                    variant: 'destructive',
                });
            }
        } catch (error: any) {
            setToast({
                title: 'Error',
                description: error.message || 'Failed to update user.',
                variant: 'destructive',
            });
        }
        setIsLoading(false);
    };

    const copyToClipboard = () => {
        if (profile) {
            navigator.clipboard.writeText(profile._id).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    };

    return {
        profile,
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