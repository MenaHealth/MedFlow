// components/adminDashboard/sections/AdminManagementViewModel.tsx
import { useSession } from 'next-auth/react';
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/hooks/useToast';
import { IAdmin } from "@/models/admin";
import { IUser } from "@/models/user";

export function useAdminManagementViewModel() {
    const [adminsData, setAdminsData] = useState<IAdmin[]>([]);
    const { data: session } = useSession();
    const token = session?.user.token;
    const { setToast } = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<IUser[]>([]);

    const fetchAllAdmins = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/GET/existing-admins', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error('Failed to fetch admins');
            }

            const data = await res.json();
            setAdminsData(data.admins || []);
        } catch (error) {
            console.error('Error fetching admins:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to fetch admins.',
                variant: 'destructive',
            });
        }
    }, [token, setToast]);

    useEffect(() => {
        fetchAllAdmins();
    }, [fetchAllAdmins]);

    const searchUsers = async (query: string) => {
        if (query.length < 3) {
            setSearchResults([]);
            return;
        }

        try {
            const res = await fetch(`/api/admin/GET/search-users?email=${encodeURIComponent(query)}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error('Failed to search users');

            const data = await res.json();
            setSearchResults(data.users);
        } catch (error) {
            console.error('Error searching users:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to search users.',
                variant: 'destructive',
            });
        }
    };

    const handleAddAdmin = async (userId: string) => {
        try {
            const res = await fetch(`/api/admin/POST/admin-mgmt-add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }),
            });

            if (!res.ok) throw new Error('Failed to add admin');

            setToast?.({
                title: 'Success',
                description: 'Admin added successfully.',
                variant: 'default',
            });

            await fetchAllAdmins();
        } catch (error) {
            console.error('Error adding admin:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to add admin.',
                variant: 'destructive',
            });
        }
    };

    const handleRemoveAdmin = async (adminId: string) => {
        try {
            const res = await fetch(`/api/admin/POST/admin-mgmt-remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ adminId }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to remove admin');
            }

            setToast?.({
                title: 'Success',
                description: 'Admin removed successfully.',
                variant: 'default',
            });

            await fetchAllAdmins();
        } catch (error) {
            console.error('Error removing admin:', error);
            setToast?.({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to remove admin.',
                variant: 'destructive',
            });
        }
    };

    return {
        adminsData,
        searchQuery,
        setSearchQuery,
        searchResults,
        handleAddAdmin,
        handleRemoveAdmin,
        fetchAllAdmins,
        searchUsers,
    };
}

