// components/auth/adminDashboard/AdminDashboardViewModel.tsx

import { useState, useCallback, useRef } from 'react';

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
    const [isPendingApprovalsOpen, setIsPendingApprovalsOpen] = useState(false);
    const [isExistingUsersOpen, setIsExistingUsersOpen] = useState(false);
    const [isDeniedUsersOpen, setIsDeniedUsersOpen] = useState(false);
    const [isAddAdminUsersOpen, setIsAddAdminUsersOpen] = useState(false);

    const [loadingPendingApprovals, setLoadingPendingApprovals] = useState(false);
    const [loadingExistingUsers, setLoadingExistingUsers] = useState(false);
    const [loadingDeniedUsers, setLoadingDeniedUsers] = useState(false);
    const [loadingAdmins, setLoadingAdmins] = useState(false);

    const [pendingApprovalsData, setPendingApprovalsData] = useState<User[]>([]);
    const [existingUsersData, setExistingUsersData] = useState<User[]>([]);
    const [deniedUsersData, setDeniedUsersData] = useState<User[]>([]);
    const [adminsData, setAdminsData] = useState<User[]>([]);


    const [isMedOrderOpen, setIsMedOrderOpen] = useState(false);
    const [loadingMedOrders, setLoadingMedOrders] = useState(false);
    const [medOrdersData, setMedOrdersData] = useState([]);

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchedSections = useRef<{ pending: boolean, existing: boolean, denied: boolean, admins: boolean }>({
        pending: false,
        existing: false,
        denied: false,
        admins: false,
    });

    const fetchPendingApprovals = useCallback(async () => {
        try {
            setLoadingPendingApprovals(true);
            const res = await fetch(`/api/admin/GET/pending-users?page=${currentPage}&limit=20`);
            if (!res.ok) throw new Error('Failed to fetch pending approvals');
            const data = await res.json();
            setPendingApprovalsData(data.users || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching pending users:', error);
        } finally {
            setLoadingPendingApprovals(false);
        }
    }, [currentPage]);

    const fetchExistingUsers = useCallback(async () => {
        try {
            setLoadingExistingUsers(true);
            const res = await fetch(`/api/admin/GET/existing-users?page=${currentPage}&limit=20`);
            if (!res.ok) throw new Error('Failed to fetch existing users');
            const data = await res.json();
            setExistingUsersData(data.users || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching existing users:', error);
        } finally {
            setLoadingExistingUsers(false);
        }
    }, [currentPage]);

    const fetchDeniedUsers = useCallback(async () => {
        try {
            setLoadingDeniedUsers(true);
            const res = await fetch('/api/admin/GET/denied-users');
            if (!res.ok) throw new Error('Failed to fetch denied users');
            const data = await res.json();
            setDeniedUsersData(data.users || []);
        } catch (error) {
            console.error('Error fetching denied users:', error);
        } finally {
            setLoadingDeniedUsers(false);
        }
    }, []);

    const fetchAdmins = useCallback(async () => {
        try {
            setLoadingAdmins(true);
            const res = await fetch(`/api/admin/management?page=${currentPage}&limit=20`);
            if (!res.ok) throw new Error('Failed to fetch admins');
            const data = await res.json();
            setAdminsData(data.admins || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching admins:', error);
        } finally {
            setLoadingAdmins(false);
        }
    }, [currentPage]);

    const fetchMedOrders = useCallback(async () => {
        try {
            setLoadingMedOrders(true);
            const res = await fetch(`/api/admin/GET/med-orders?page=${currentPage}&limit=20`);
            if (!res.ok) throw new Error('Failed to fetch med orders');
            const data = await res.json();
            setMedOrdersData(data.orders || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching med orders:', error);
        } finally {
            setLoadingMedOrders(false);
        }
    }, [currentPage]);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchPendingApprovals();
        await fetchExistingUsers();
        await fetchDeniedUsers();
        await fetchAdmins();
        setIsRefreshing(false);
    }, [fetchPendingApprovals, fetchExistingUsers, fetchDeniedUsers, fetchAdmins]);


    const toggleSection = useCallback(
        async (section: 'pending' | 'existing' | 'denied' | 'addAdmin' | 'medOrder') => {
            let shouldFetch = false;

            if (section === 'pending') {
                setIsPendingApprovalsOpen((prev) => {
                    shouldFetch = !prev;
                    fetchedSections.current.pending = shouldFetch;
                    return !prev;
                });
                if (shouldFetch) await fetchPendingApprovals();
            } else if (section === 'existing') {
                setIsExistingUsersOpen((prev) => {
                    shouldFetch = !prev;
                    fetchedSections.current.existing = shouldFetch;
                    return !prev;
                });
                if (shouldFetch) await fetchExistingUsers();
            } else if (section === 'denied') {
                setIsDeniedUsersOpen((prev) => {
                    shouldFetch = !prev;
                    fetchedSections.current.denied = shouldFetch;
                    return !prev;
                });
                if (shouldFetch) await fetchDeniedUsers();
            } else if (section === 'addAdmin') {
                setIsAddAdminUsersOpen((prev) => {
                    shouldFetch = !prev;
                    fetchedSections.current.admins = shouldFetch;
                    return !prev;
                });
                if (shouldFetch) await fetchAdmins();
            } else if (section === 'medOrder') {
                setIsMedOrderOpen((prev) => {
                    shouldFetch = !prev;
                    fetchedSections.current.admins = shouldFetch;
                    return !prev;
                });
                if (shouldFetch) await fetchMedOrders();
            }
        },
        [fetchAdmins, fetchPendingApprovals, fetchExistingUsers, fetchDeniedUsers, fetchMedOrders]
    );
    return {
        isPendingApprovalsOpen,
        isExistingUsersOpen,
        isDeniedUsersOpen,
        isAddAdminUsersOpen,
        loadingPendingApprovals,
        loadingExistingUsers,
        loadingDeniedUsers,
        loadingAdmins,
        pendingApprovalsData,
        existingUsersData,
        deniedUsersData,
        setDeniedUsersData,
        adminsData,
        isMedOrderOpen,
        loadingMedOrders,
        medOrdersData,
        toggleSection,
        totalPages,
        currentPage,
        setCurrentPage,
        handleRefresh,
        isRefreshing
    };
}