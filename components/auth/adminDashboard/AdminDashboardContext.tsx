// components/auth/adminDashboard/AdminDashboardContext.tsx

import React, { createContext, useContext, ReactNode } from 'react';
import { useAdminDashboardViewModel } from './AdminDashboardViewModel';

interface AdminDashboardContextType {
    isPendingApprovalsOpen: boolean;
    isExistingUsersOpen: boolean;
    isDeniedUsersOpen: boolean;
    isAddAdminUsersOpen: boolean;
    isMedOrderOpen: boolean;                     // Added for Med Orders
    loadingPendingApprovals: boolean;
    loadingExistingUsers: boolean;
    loadingDeniedUsers: boolean;
    loadingAdmins: boolean;
    loadingMedOrders: boolean;                   // Added for Med Orders
    pendingApprovalsData: any;
    existingUsersData: any;
    deniedUsersData: any[];
    medOrdersData: any[];                        // Added for Med Orders
    setDeniedUsersData: React.Dispatch<React.SetStateAction<any[]>>;
    adminsData: any;
    toggleSection: (section: 'pending' | 'existing' | 'denied' | 'addAdmin' | 'medOrder') => void;
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