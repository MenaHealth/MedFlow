// AdminDashboardContext.tsx
import React, {createContext, useContext, useState, useCallback, ReactNode, useRef} from 'react';

// Define the context structure
interface AdminDashboardContextType {
    isPendingApprovalsOpen: boolean;
    isExistingUsersOpen: boolean;
    isDeniedUsersOpen: boolean;
    isAddAdminUsersOpen: boolean;
    loadingPendingApprovals: boolean;
    loadingExistingUsers: boolean;
    loadingDeniedUsers: boolean;
    loadingAdmins: boolean;
    pendingApprovalsData: any;
    existingUsersData: any;
    deniedUsersData: User[];
    setDeniedUsersData: React.Dispatch<React.SetStateAction<User[]>>;
    adminsData: any;
    toggleSection: (section: 'pending' | 'existing' | 'denied' | 'addAdmin') => void;
    totalPages: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    handleRefresh: () => void;
    isRefreshing: boolean;
}

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: 'Doctor' | 'Triage';
    countries?: string[];
    denialDate?: string;
}


const AdminDashboardContext = createContext<AdminDashboardContextType | undefined>(undefined);

export const useAdminDashboard = () => {
    const context = useContext(AdminDashboardContext);
    if (!context) {
        throw new Error("useAdminDashboard must be used within AdminDashboardProvider");
    }
    return context;
};

export const AdminDashboardProvider = ({ children }: { children: ReactNode }) => {
    const [isPendingApprovalsOpen, setIsPendingApprovalsOpen] = useState(false);
    const [isExistingUsersOpen, setIsExistingUsersOpen] = useState(false);
    const [isDeniedUsersOpen, setIsDeniedUsersOpen] = useState(false);
    const [isAddAdminUsersOpen, setIsAddAdminUsersOpen] = useState(false);

    const [loadingPendingApprovals, setLoadingPendingApprovals] = useState(false);
    const [loadingExistingUsers, setLoadingExistingUsers] = useState(false);
    const [loadingDeniedUsers, setLoadingDeniedUsers] = useState(false);
    const [loadingAdmins, setLoadingAdmins] = useState(false);

    const [pendingApprovalsData, setPendingApprovalsData] = useState<User[]>([]);
    const [existingUsersData, setExistingUsersData] = useState(null);
    const [deniedUsersData, setDeniedUsersData] = useState<User[]>([]);
    const [adminsData, setAdminsData] = useState(null);

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [refresh, setRefresh] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true); // Set isRefreshing to true when refresh starts
        await fetchPendingApprovals();
        await fetchExistingUsers();
        await fetchDeniedUsers();
        await fetchAdmins();
        setIsRefreshing(false);
    };


    const fetchPendingApprovals = async () => {
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
    };

    const fetchExistingUsers = async () => {
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
    };

    const fetchDeniedUsers = async () => {
        try {
            setLoadingDeniedUsers(true);
            const res = await fetch('/api/admin/GET/denied-users');
            if (!res.ok) throw new Error('Failed to fetch denied users');

            const data = await res.json();
            console.log('Fetched Denied Users:', data);  // Debugging log
            setDeniedUsersData(data.users || []); // Adjust based on actual response structure
        } catch (error) {
            console.error('Error fetching denied users:', error);
        } finally {
            setLoadingDeniedUsers(false);
        }
    };

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

    const fetchedSections = useRef<{ pending: boolean, existing: boolean, denied: boolean, admins: boolean }>({
        pending: false,
        existing: false,
        denied: false,
        admins: false,
    });


    const toggleSection = useCallback(
        async (section: 'pending' | 'existing' | 'denied' | 'addAdmin') => {
            let shouldFetch = false;

            if (refresh) {
                if (section === 'pending') {
                    await fetchPendingApprovals();
                } else if (section === 'existing') {
                    await fetchExistingUsers();
                } else if (section === 'denied') {
                    await fetchDeniedUsers();
                } else if (section === 'addAdmin') {
                    await fetchAdmins();
                }
                setRefresh(false);
            }

            else if (section === 'pending') {
                setIsPendingApprovalsOpen(prev => {
                    shouldFetch = !prev && !fetchedSections.current.pending;
                    return !prev;
                });
                if (shouldFetch) {
                    fetchedSections.current.pending = true;
                    await fetchPendingApprovals();
                }
            } else if (section === 'existing') {
                setIsExistingUsersOpen(prev => {
                    shouldFetch = !prev && !fetchedSections.current.existing;
                    return !prev;
                });
                if (shouldFetch) {
                    fetchedSections.current.existing = true;
                    await fetchExistingUsers();
                }
            } else if (section === 'denied') {
                setIsDeniedUsersOpen(prev => {
                    shouldFetch = !prev && !fetchedSections.current.denied;
                    return !prev;
                });
                if (shouldFetch) {
                    fetchedSections.current.denied = true;
                    await fetchDeniedUsers();
                }
            } else if (section === 'addAdmin') {
                setIsAddAdminUsersOpen(prev => {
                    shouldFetch = !prev && !fetchedSections.current.admins;
                    return !prev;
                });
                if (shouldFetch) {
                    fetchedSections.current.admins = true;
                    await fetchAdmins();
                }
            }
        },
        [fetchAdmins, refresh]
    );
    return (
        <AdminDashboardContext.Provider value={{
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
            setDeniedUsersData,
            deniedUsersData,
            adminsData,
            toggleSection,
            totalPages,
            currentPage,
            setCurrentPage,
            handleRefresh,
            isRefreshing
        }}>
            {children}
        </AdminDashboardContext.Provider>
    );
};