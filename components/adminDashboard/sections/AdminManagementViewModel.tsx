import { useSession } from 'next-auth/react';
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/hooks/useToast';
import { IAdmin } from "@/models/admin";

export function useAdminManagementViewModel() {
    const [adminsData, setAdminsData] = useState<IAdmin[]>([]);
    const { data: session } = useSession();
    const token = session?.user.token;
    const { setToast } = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<IAdmin[]>([]);

    const fetchAllAdmins = useCallback(async () => {
        try {
            console.log("Fetching all admins...");
            const res = await fetch('/api/admin/GET/existing-admins', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                console.error("Failed to fetch admins. Response status:", res.status);
                throw new Error('Failed to fetch admins');
            }

            const data = await res.json();
            console.log("Raw data fetched from API:", data);

            setAdminsData(data.admins || []);
            console.log("Admins data set in state:", data.admins || []);
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

    useEffect(() => {
        console.log("Admins data in state:", adminsData);
    }, [adminsData]);

    const handleSearch = useCallback(async () => {
        if (!searchQuery) return;

        try {
            const res = await fetch(`/api/admin/GET/admin-mgmt-search?search=${encodeURIComponent(searchQuery)}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error('Failed to search admins');

            const data = await res.json();
            setSelectedUser(data.admins || []);
        } catch (error) {
            console.error('Error searching admins:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to search admins.',
                variant: 'destructive',
            });
        }
    }, [searchQuery, token, setToast]);

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

            await fetchAllAdmins(); // Reload admins after adding
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

            if (!res.ok) throw new Error('Failed to remove admin');

            setToast?.({
                title: 'Success',
                description: 'Admin removed successfully.',
                variant: 'default',
            });

            await fetchAllAdmins(); // Reload admins after removing
        } catch (error) {
            console.error('Error removing admin:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to remove admin.',
                variant: 'destructive',
            });
        }
    };

    return {
        adminsData,
        handleSearch,
        searchQuery,
        setSearchQuery,
        selectedUser,
        setSelectedUser,
        handleAddAdmin,
        handleRemoveAdmin,
        fetchAllAdmins,
    };
}

