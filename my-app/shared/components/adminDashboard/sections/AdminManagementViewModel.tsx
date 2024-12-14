import { useSession } from 'next-auth/react';
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/hooks/useToast';
import { IAdmin } from "@/models/admin";
import Fuse from 'fuse.js';

export function useAdminManagementViewModel() {
    const [allAdmins, setAllAdmins] = useState<IAdmin[]>([]);
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
            setAllAdmins(data.admins || []);
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

    const fuseOptions = {
        isCaseSensitive: false,
        includeScore: true,
        // shouldSort: true,
        // includeMatches: true,
        // findAllMatches: false,
        minMatchCharLength: 2,
        // location: 0,
        threshold: 0.3,
        // distance: 100,
        // useExtendedSearch: false,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        // fieldNormWeight: 1,
        keys: [
            "email",
            "firstName",
            "lastName"
        ]
    };
    
    const fuse = new Fuse(allAdmins, fuseOptions);
    const handleSearch = useCallback(async () => {
        if (!searchQuery) {
            setAdminsData(allAdmins);
            return;
        };

        const searchData = fuse.search(searchQuery);
        setAdminsData(searchData.map((result) => result.item));
    }, [allAdmins, searchQuery]);

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

