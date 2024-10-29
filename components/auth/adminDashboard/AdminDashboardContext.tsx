// components/auth/adminDashboard/AdminDashboardContext.tsx


import React, { createContext, useContext, ReactNode } from 'react';
import { useAdminDashboardViewModel } from './AdminDashboardViewModel';

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
    deniedUsersData: any[];
    setDeniedUsersData: React.Dispatch<React.SetStateAction<any[]>>;
    adminsData: any;
    toggleSection: (section: 'pending' | 'existing' | 'denied' | 'addAdmin') => void;
    totalPages: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    handleRefresh: () => void;
    isRefreshing: boolean;
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
    const viewModel = useAdminDashboardViewModel();

    return (
        <AdminDashboardContext.Provider value={viewModel}>
            {children}
        </AdminDashboardContext.Provider>
    );
};