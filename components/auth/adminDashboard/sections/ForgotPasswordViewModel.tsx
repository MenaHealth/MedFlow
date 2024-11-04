// components/auth/adminDashboard/sections/ForgotPasswordViewModel.tsx

import { useSession } from 'next-auth/react';
import { useState, useCallback } from 'react';
import useToast from '@/components/hooks/useToast';

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
            setToast?.({
                title: 'Error',
                description: 'Failed to search user.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
        return;
    }, [searchQuery, token, setToast]);

    // Generate a temporary reset link for the user
    const generateResetLink = async () => {
        if (!selectedUser) return;

        try {
            const response = await fetch('/api/admin/POST/forgot-password-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: selectedUser._id }),
            });

            if (!response.ok) throw new Error('Failed to generate reset link');
            const data = await response.json();

            // Update selectedUser with the reset link and expiration
            setSelectedUser((prev) => (prev ? { ...prev, resetLink: data.resetLink, resetLinkExpiration: data.resetLinkExpiration } : null));

            setToast?.({
                title: 'Success',
                description: 'Password reset link generated.',
                variant: 'default',
            });
        } catch (error) {
            console.error('Error generating reset link:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to generate reset link.',
                variant: 'destructive',
            });
        }
    };

    return {
        searchQuery,
        setSearchQuery,
        selectedUser,
        handleSearch,
        generateResetLink,
        loading,
    };
}