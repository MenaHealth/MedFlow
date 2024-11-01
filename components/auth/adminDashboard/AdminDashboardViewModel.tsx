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

export function useAdminDashboardViewModel() {
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);

    const [isnewSignupsOpen, setIsnewSignupsOpen] = useState(false);
    const [isExistingUsersOpen, setIsExistingUsersOpen] = useState(false);
    const [isDeniedUsersOpen, setIsDeniedUsersOpen] = useState(false);
    const [isAddAdminUsersOpen, setIsAddAdminUsersOpen] = useState(false);
    const [isMedOrderOpen, setIsMedOrderOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);


    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [deniedUsers, setDeniedUsers] = useState<User[]>([]);

    const next = async () => {
        if (loading || !hasMore) return; // Prevent duplicate fetches

        setLoading(true);
        try {
            const data = await fetchDeniedUsers(page);
            setDeniedUsers((prev) => [...prev, ...data.users]);
            setPage((prev) => prev + 1);
            setHasMore(data.users.length === 20); // Set `hasMore` based on page size
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching denied users:', error);
            setHasMore(false); // Stop further attempts if there's an error
        } finally {
            setLoading(false);
        }
    };

    const fetchDeniedUsers = async (page: number) => {
        const res = await fetch(`/api/admin/GET/denied-users?page=${page}&limit=20`);
        if (!res.ok) throw new Error('Failed to fetch denied users');
        return res.json();
    };
    const deniedUsersQuery = useQuery(
        ['deniedUsers', currentPage],
        () => fetchDeniedUsers(currentPage),
        { enabled: isDeniedUsersOpen }
    );

    const fetchNewSignups = async (page: number) => {
        const res = await fetch(`/api/admin/GET/new-users?page=${page}&limit=20`);
        if (!res.ok) throw new Error('Failed to fetch new signups');
        return res.json();
    };
    const newSignupsQuery = useQuery(
        ['newSignups', currentPage],
        () => fetchNewSignups(currentPage),
        { enabled: isnewSignupsOpen }
    );

    const fetchExistingUsers = async (page: number) => {
        const res = await fetch(`/api/admin/GET/existing-users?page=${page}&limit=20`);
        if (!res.ok) throw new Error('Failed to fetch existing users');
        return res.json();
    };
    const existingUsersQuery = useQuery(
        ['existingUsers', currentPage],
        () => fetchExistingUsers(currentPage),
        { enabled: isExistingUsersOpen }
    );

    const fetchAdmins = async (page: number) => {
        const res = await fetch(`/api/admin/management?page=${page}&limit=20`);
        if (!res.ok) throw new Error('Failed to fetch admins');
        return res.json();
    };
    const adminsQuery = useQuery(
        ['admins', currentPage],
        () => fetchAdmins(currentPage),
        { enabled: isAddAdminUsersOpen }
    );

    const fetchMedOrders = async (page: number) => {
        const res = await fetch(`/api/admin/GET/med-orders?page=${page}&limit=20`);
        if (!res.ok) throw new Error('Failed to fetch med orders');
        return res.json();
    };
    const medOrdersQuery = useQuery(
        ['medOrders', currentPage],
        () => fetchMedOrders(currentPage),
        { enabled: isMedOrderOpen }
    );

    // Define loading states for each query
    const loadingNewSignups = newSignupsQuery.isLoading;
    const loadingExistingUsers = existingUsersQuery.isLoading;
    const loadingDeniedUsers = deniedUsersQuery.isLoading;
    const loadingAdmins = adminsQuery.isLoading;

    const handleRefresh = useCallback(() => {
        setDeniedUsers([]); // Reset data
        setPage(0);          // Reset page
        setHasMore(true);    // Reset hasMore
        queryClient.invalidateQueries(['deniedUsers']);
    }, [queryClient]);

    const toggleSection = useCallback((section: 'newSignups' | 'existing' | 'denied' | 'addAdmin' | 'medOrder') => {
        if (section === 'newSignups') setIsnewSignupsOpen((prev) => !prev);
        else if (section === 'existing') setIsExistingUsersOpen((prev) => !prev);
        else if (section === 'denied') setIsDeniedUsersOpen((prev) => !prev);
        else if (section === 'addAdmin') setIsAddAdminUsersOpen((prev) => !prev);
        else if (section === 'medOrder') setIsMedOrderOpen((prev) => !prev);
    }, []);

    return {
        isNewSignupsOpen: isnewSignupsOpen,
        isExistingUsersOpen,
        isDeniedUsersOpen,
        isAddAdminUsersOpen,
        loadingNewSignups,
        loadingExistingUsers,
        loadingDeniedUsers,
        loadingAdmins,
        newSignupsData: newSignupsQuery.data?.users || [],
        existingUsersData: existingUsersQuery.data?.users || [],
        deniedUsersData: deniedUsersQuery.data?.users || [], // Simplified
        adminsData: adminsQuery.data?.admins || [],
        isMedOrderOpen,
        loadingMedOrders: medOrdersQuery.isLoading,
        medOrdersData: medOrdersQuery.data?.orders || [],
        toggleSection,
        totalPages: deniedUsersQuery.data?.totalPages || 1, // Simplified total pages
        currentPage: page,
        setCurrentPage,
        handleRefresh,
        isRefreshing,
        deniedUsers,
        hasMore,
        loading,
        next,
    };
}