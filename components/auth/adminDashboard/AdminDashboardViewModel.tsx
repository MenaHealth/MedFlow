import { useQuery, useQueryClient } from 'react-query';
import { useState, useCallback } from 'react';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: 'Doctor' | 'Triage';
    countries?: string[];
    denialDate?: string;
}

interface AdminUser extends User {
    // Add any additional fields specific to admin users
}

export function useAdminDashboardViewModel() {
    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Section visibility states
    const [isnewSignupsOpen, setIsnewSignupsOpen] = useState(false);
    const [isExistingUsersOpen, setIsExistingUsersOpen] = useState(false);
    const [isAddAdminUsersOpen, setIsAddAdminUsersOpen] = useState(false);
    const [isMedOrderOpen, setIsMedOrderOpen] = useState(false); // Added isMedOrderOpen state

    // Generic fetch function
    const fetchData = async (endpoint: string, page: number, limit: number) => {
        const res = await fetch(`/api/admin/${endpoint}?page=${page}&limit=${limit}`);
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

    // Denied Users
    const [deniedUsers, setDeniedUsers] = useState<User[]>([]);
    const [deniedUsersPage, setDeniedUsersPage] = useState(1);
    const [hasMoreDeniedUsers, setHasMoreDeniedUsers] = useState(true);
    const [loadingDeniedUsers, setLoadingDeniedUsers] = useState(false);
    const [isDeniedUsersOpen, setIsDeniedUsersOpen] = useState(false);

    const fetchDeniedUsers = async (page: number) => {
        const response = await fetch(`/api/admin/GET/denied-users?page=${page}&limit=20`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    };

    const deniedUsersQuery = useQuery(
        ['deniedUsers', deniedUsersPage],
        () => fetchDeniedUsers(deniedUsersPage),
        {
            enabled: isDeniedUsersOpen,
            keepPreviousData: true,
            onSuccess: (data) => {
                setDeniedUsers((prev) => [...prev, ...data.users]);
                setHasMoreDeniedUsers(data.users.length === 20);
                setLoadingDeniedUsers(false);
            },
            onError: () => setLoadingDeniedUsers(false),
        }
    );

    const nextDeniedUsers = useCallback(() => {
        if (loadingDeniedUsers || !hasMoreDeniedUsers) return;
        setLoadingDeniedUsers(true);
        setDeniedUsersPage((prev) => prev + 1);
    }, [loadingDeniedUsers, hasMoreDeniedUsers]);

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
                setAdminUsers((prev) => [...prev, ...data.admins]);
                setHasMoreAdminUsers(data.admins.length === 20);
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
        setDeniedUsers([]);
        setDeniedUsersPage(1);
        setAdminUsers([]);
        setAdminUsersPage(1);
        queryClient.invalidateQueries(['newSignups', 'existingUsers', 'deniedUsers', 'admins']);
        setIsRefreshing(false);
    }, [queryClient]);

    const toggleSection = useCallback((section: 'newSignups' | 'existing' | 'denied' | 'addAdmin' | 'medOrder') => { // Updated toggleSection function
        if (section === 'newSignups') setIsnewSignupsOpen((prev) => !prev);
        else if (section === 'existing') setIsExistingUsersOpen((prev) => !prev);
        else if (section === 'denied') {
            setIsDeniedUsersOpen((prev) => {
                if (!prev) {
                    setDeniedUsers([]);
                    setDeniedUsersPage(1);
                    setHasMoreDeniedUsers(true);
                    queryClient.invalidateQueries(['deniedUsers']);
                }
                return !prev;
            });
        }
        else if (section === 'addAdmin') setIsAddAdminUsersOpen((prev) => !prev);
        else if (section === 'medOrder') setIsMedOrderOpen((prev) => !prev); // Added medOrder case
    }, [queryClient]);

    return {
        // Section visibility
        isNewSignupsOpen: isnewSignupsOpen,
        isExistingUsersOpen,
        isDeniedUsersOpen,
        isAddAdminUsersOpen,
        isMedOrderOpen, // Added isMedOrderOpen to returned object

        // New Signups
        newSignups,
        loadingNewSignups,
        hasMoreNewSignups,
        nextNewSignups,

        // Existing Users
        existingUsers,
        loadingExistingUsers,
        hasMoreExistingUsers,
        nextExistingUsers,

        // Denied Users
        deniedUsers,
        loadingDeniedUsers,
        hasMoreDeniedUsers,
        nextDeniedUsers,

        // Admin Users
        adminUsers,
        loadingAdminUsers,
        hasMoreAdminUsers,
        nextAdminUsers,

        // Common functions
        toggleSection,
        handleRefresh,
        isRefreshing,
    };
}