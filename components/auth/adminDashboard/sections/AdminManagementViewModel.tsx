import { useSession } from 'next-auth/react';
import { useState, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useToast } from '@/components/hooks/useToast';
import { IAdmin } from "@/models/admin";
import { Types } from 'mongoose';

export function useAdminManagementViewModel() {
    const [adminsData, setAdminsData] = useState<IAdmin[]>([]);
    const { data: session } = useSession();
    const token = session?.user.token;
    const queryClient = useQueryClient();
    const { setToast } = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [currentOffset, setCurrentOffset] = useState(0);
    const [loadingAdmins, setLoadingAdmins] = useState(false);
    const [hasMoreAdmins, setHasMoreAdmins] = useState(true);
    const limit = 20;

    const fetchAdmins = async (offset: number): Promise<IAdmin[]> => {
        const response = await fetch(`/api/admin/management?offset=${offset}&limit=${limit}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch admins');
        const data = await response.json();
        return data.admins || [];
    };

    const loadMoreAdmins = useCallback(async () => {
        if (loadingAdmins || !hasMoreAdmins) return;

        setLoadingAdmins(true);
        try {
            const newAdmins = await fetchAdmins(currentOffset);
            setAdminsData((prev) => [...prev, ...newAdmins]);
            setHasMoreAdmins(newAdmins.length === limit);
            setCurrentOffset((prevOffset) => prevOffset + limit);
        } catch (error) {
            console.error('Error loading more admins:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to load more admins.',
                variant: 'destructive',
            });
        } finally {
            setLoadingAdmins(false);
        }
    }, [loadingAdmins, hasMoreAdmins, currentOffset, setToast, token]);

    const handleAddAdmin = async () => {
        if (!selectedUser) {
            setToast?.({
                title: 'Error',
                description: 'Please select a user to add as admin.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await fetch('/api/admin/management', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: selectedUser }),
            });

            if (!response.ok) throw new Error('Failed to add admin');

            setToast?.({
                title: 'Success',
                description: 'User successfully added as admin.',
                variant: 'default',
            });

            setSelectedUser(null);
            setAdminsData([]);
            setCurrentOffset(0);
            setHasMoreAdmins(true);
            loadMoreAdmins();
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
        if (adminsData.length <= 1) {
            setToast?.({
                title: 'Error',
                description: 'There must be at least one admin.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await fetch('/api/admin/management', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ adminId }),
            });

            if (!response.ok) throw new Error('Failed to remove admin');

            setToast?.({
                title: 'Success',
                description: 'Admin removed successfully.',
                variant: 'default',
            });

            setAdminsData((prev) => prev.filter((admin) => admin.userId.toString() !== adminId));
        } catch (error) {
            console.error('Error removing admin:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to remove admin.',
                variant: 'destructive',
            });
        }
    };

    const handleRemoveSelectedAdmins = async (adminIds: string[]) => {
        try {
            const response = await fetch('/api/admin/management/bulk-delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ adminIds }),
            });

            if (!response.ok) throw new Error('Failed to delete selected admins');

            setToast?.({
                title: 'Success',
                description: 'Selected admins removed successfully.',
                variant: 'default',
            });

            setAdminsData((prev) => prev.filter((admin) => !adminIds.includes(admin.userId.toString())));
        } catch (error) {
            console.error('Error removing selected admins:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to delete selected admins.',
                variant: 'destructive',
            });
        }
    };

    const handleSearch = useCallback(async () => {
        if (!searchQuery) return;

        try {
            const res = await fetch(`/api/admin/GET/existing-users?search=${searchQuery}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setSelectedUser(data.users || []);
        } catch (error) {
            console.error('Error searching users:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to search users.',
                variant: 'destructive',
            });
        }
    }, [searchQuery, setToast, token]);

    return {
        adminsData,
        loadingAdmins,
        hasMoreAdmins,
        loadMoreAdmins,
        handleAddAdmin,
        handleRemoveAdmin,
        handleSearch,
        searchQuery,
        setSearchQuery,
        selectedUser,
        setSelectedUser,
        handleRemoveSelectedAdmins,
    };
}

