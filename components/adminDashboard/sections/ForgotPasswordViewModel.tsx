// components/auth/adminDashboard/sections/ForgotPasswordViewModel.tsx

import { useSession, signOut } from 'next-auth/react';
import { useState, useCallback } from 'react';
import { useToast } from '@/components/hooks/useToast';
import { useQueryClient, useMutation } from 'react-query';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: string;
    country?: string;
    language?: string;
    doctorSpecialty?: string;
    approvalDate?: Date;
    passwordResetCount?: number;
    resetLink?: string;
    resetLinkExpiration?: string;
}

export function useForgotPasswordViewModel() {
    const { data: session } = useSession();
    const token = session?.user.token;
    const { setToast } = useToast();
    const queryClient = useQueryClient();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    // Search for user by email
    const handleSearch = useCallback(async () => {
        if (!searchQuery) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/GET/forgot-password/user-search?email=${searchQuery}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to fetch user');
            const data = await res.json();
            setSelectedUser(data.user || null);
        } catch (error) {
            console.error('Error searching user:', error);
            setToast({
                title: 'Error',
                description: 'Failed to search user.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [searchQuery, token, setToast]);

    // Generate a temporary reset link for the user
    const generateResetLink = useMutation(
        async () => {
            if (!selectedUser) throw new Error('No user selected');
            const response = await fetch('/api/admin/POST/forgot-password-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: selectedUser._id }),
            });
            if (!response.ok) throw new Error('Failed to generate reset link');
            return response.json();
        },
        {
            onSuccess: (data) => {
                setSelectedUser((prev) => (prev ? { ...prev, resetLink: data.resetLink, resetLinkExpiration: data.resetLinkExpiration } : null));
                setToast({
                    title: 'Success',
                    description: 'Password reset link generated.',
                    variant: 'default',
                });
            },
            onError: (error: any) => {
                setToast({
                    title: 'Error',
                    description: error.message || 'Failed to generate reset link.',
                    variant: 'destructive',
                });
            },
        }
    );

    const clearExpiredLinks = useMutation(
        async () => {
            const response = await fetch('/api/admin/POST/clear-expired-password-links', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('JWT_EXPIRED');
                }
                throw new Error('Failed to clear expired links');
            }
            return response.json();
        },
        {
            onSuccess: (data) => {
                setToast({
                    title: 'Success',
                    description: `Cleared ${data.modifiedCount} expired link(s).`,
                    variant: 'default',
                });

                // If the current user's link was expired, update the UI
                if (selectedUser?.resetLinkExpiration && new Date(selectedUser.resetLinkExpiration) < new Date()) {
                    setSelectedUser(prev => prev ? { ...prev, resetLink: undefined, resetLinkExpiration: undefined } : null);
                }

                queryClient.invalidateQueries('newSignups');
            },
            onError: (error: any) => {
                if (error.message === 'JWT_EXPIRED') {
                    setToast({
                        title: 'Session Expired',
                        description: 'Please log out and log back in to refresh your session.',
                        variant: 'destructive',
                    });
                } else {
                    setToast({
                        title: 'Error',
                        description: error.message || 'Failed to clear expired links.',
                        variant: 'destructive',
                    });
                }
            },
        }
    );

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    return {
        searchQuery,
        setSearchQuery,
        selectedUser,
        handleSearch,
        generateResetLink: generateResetLink.mutate,
        clearExpiredLinks: clearExpiredLinks.mutate,
        loading: loading || generateResetLink.isLoading || clearExpiredLinks.isLoading,
        handleLogout,
    };
}

