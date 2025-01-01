// components/auth/adminDashboard/AdminDashboardViewModel.ts

import { useQuery, useQueryClient } from 'react-query';
import { useState, useCallback } from 'react';
import {useSession} from "next-auth/react";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: 'Doctor' | 'Triage' | 'Evac';
    countries?: string[];
    denialDate?: string;
}

interface AdminUser extends User {
    // Add any additional fields specific to admin users
}

export function useAdminDashboardViewModel() {
    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [openSection, setOpenSection] = useState<string | null>(null);

    // Section visibility states
    const [isnewSignupsOpen, setIsnewSignupsOpen] = useState(false);
    const [isExistingUsersOpen, setIsExistingUsersOpen] = useState(false);
    const [isAddAdminUsersOpen, setIsAddAdminUsersOpen] = useState(false);
    const [isMedOrderOpen, setIsMedOrderOpen] = useState(false);

    const [isCountryVisible, setIsCountryVisible] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const toggleCountryVisibility = () => setIsCountryVisible((prev) => !prev);
    const toggleSelecting = () => setIsSelecting((prev) => !prev);

    const handleCheckboxChange = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const { data: session } = useSession();
    const fetchData = async (endpoint: string, page: number, limit: number) => {
        const token = session?.user.token; // Get the token from the session
        const res = await fetch(`/api/admin/${endpoint}?page=${page}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${token}`,  // Include the JWT token in the headers
            }
        });
        if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
        return res.json();
    };

    // New Signups
    const [newSignups, setNewSignups] = useState<User[]>([]);
    const [newSignupsPage, setNewSignupsPage] = useState(1);
    const [hasMoreNewSignups, setHasMoreNewSignups] = useState(true);
    const [loadingNewSignups, setLoadingNewSignups] = useState(false);

    const newSignupsQuery = useQuery(
        ['newSignups', newSignupsPage],
        () => fetchData('GET/new-users', newSignupsPage, 20),
        {
            enabled: isnewSignupsOpen,
            keepPreviousData: true,
            onSuccess: (data) => {
                setNewSignups((prev) => [...prev, ...data.users]);
                setHasMoreNewSignups(data.users.length === 20);
                setLoadingNewSignups(false);
            },
            onError: () => setLoadingNewSignups(false),
        }
    );

    const nextNewSignups = useCallback(() => {
        if (loadingNewSignups || !hasMoreNewSignups) return;
        setLoadingNewSignups(true);
        setNewSignupsPage(prev => prev + 1);
    }, [loadingNewSignups, hasMoreNewSignups]);

    // Existing Users
    const [existingUsers, setExistingUsers] = useState<User[]>([]);
    const [existingUsersPage, setExistingUsersPage] = useState(1);
    const [hasMoreExistingUsers, setHasMoreExistingUsers] = useState(true);
    const [loadingExistingUsers, setLoadingExistingUsers] = useState(false);

    const existingUsersQuery = useQuery(
        ['existingUsers', existingUsersPage],
        () => fetchData('GET/existing-users', existingUsersPage, 20),
        {
            enabled: isExistingUsersOpen,
            keepPreviousData: true,
            onSuccess: (data) => {
                setExistingUsers((prev) => [...prev, ...data.users]);
                setHasMoreExistingUsers(data.users.length === 20);
                setLoadingExistingUsers(false);
            },
            onError: () => setLoadingExistingUsers(false),
        }
    );

    const nextExistingUsers = useCallback(() => {
        if (loadingExistingUsers || !hasMoreExistingUsers) return;
        setLoadingExistingUsers(true);
        setExistingUsersPage(prev => prev + 1);
    }, [loadingExistingUsers, hasMoreExistingUsers]);

    // Admin Users
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
    const [adminUsersPage, setAdminUsersPage] = useState(1);
    const [hasMoreAdminUsers, setHasMoreAdminUsers] = useState(true);
    const [loadingAdminUsers, setLoadingAdminUsers] = useState(false);

    const adminUsersQuery = useQuery(
        ['admins', adminUsersPage],
        () => fetchData('management', adminUsersPage, 20),
        {
            enabled: isAddAdminUsersOpen,
            keepPreviousData: true,
            onSuccess: (data) => {
                if (data?.admins && Array.isArray(data.admins)) {
                    setAdminUsers((prev) => [...prev, ...data.admins]);
                    setHasMoreAdminUsers(data.admins.length === 20);
                } else {
                    setHasMoreAdminUsers(false);
                }
                setLoadingAdminUsers(false);
            },
            onError: () => setLoadingAdminUsers(false),
        }
    );

    const nextAdminUsers = useCallback(() => {
        if (loadingAdminUsers || !hasMoreAdminUsers) return;
        setLoadingAdminUsers(true);
        setAdminUsersPage(prev => prev + 1);
    }, [loadingAdminUsers, hasMoreAdminUsers]);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setNewSignups([]);
        setNewSignupsPage(1);
        setExistingUsers([]);
        setExistingUsersPage(1);
        setAdminUsers([]);
        setAdminUsersPage(1);
        queryClient.invalidateQueries(['newSignups', 'existingUsers', 'admins']);
        setIsRefreshing(false);
    }, [queryClient]);

    const toggleSection = useCallback((section: 'newSignups' | 'existing' | 'denied' | 'addAdmin' | 'medOrder') => {
        setOpenSection(prev => prev === section ? null : section);
    }, []);

    return {
        openSection,
        newSignups,
        loadingNewSignups,
        hasMoreNewSignups,
        nextNewSignups,
        existingUsers,
        loadingExistingUsers,
        hasMoreExistingUsers,
        nextExistingUsers,
        adminUsers,
        loadingAdminUsers,
        hasMoreAdminUsers,
        nextAdminUsers,
        isCountryVisible,
        toggleCountryVisibility,
        isSelecting,
        toggleSelecting,
        selectedUsers,
        handleCheckboxChange,
        toggleSection,
        handleRefresh,
        isRefreshing,
    };
}