// components/auth/adminDashboard/AdminDashboardContext.tsx

import React, { createContext, useContext, ReactNode } from 'react';
import { useAdminDashboardViewModel } from './AdminDashboardViewModel';

// components/auth/adminDashboard/AdminDashboardContext.tsx

interface AdminDashboardContextType {
    isNewSignupsOpen: boolean;
    isExistingUsersOpen: boolean;
    isDeniedUsersOpen: boolean;
    isAddAdminUsersOpen: boolean;
    isMedOrderOpen: boolean;
    loadingNewSignups: boolean;
    loadingExistingUsers: boolean;
    loadingDeniedUsers: boolean;
    loadingAdmins: boolean;
    loadingMedOrders: boolean;
    newSignupsData: any;
    existingUsersData: any;
    deniedUsersData: any[];
    medOrdersData: any[];
    adminsData: any;
    toggleSection: (section: 'newSignups' | 'existing' | 'denied' | 'addAdmin' | 'medOrder') => void;
    totalPages: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    handleRefresh: () => void;
    isRefreshing: boolean;

    // Infinite scroll properties
    deniedUsers: any[];   // Replace `any` with the actual `User` type if defined
    hasMore: boolean;
    loading: boolean;
    next: () => void;
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