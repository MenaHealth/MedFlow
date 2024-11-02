// components/auth/adminDashboard/AdminDashboardContext.tsx

import React, { createContext, useContext, ReactNode } from 'react';
import { useAdminDashboardViewModel } from './AdminDashboardViewModel';

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: 'Doctor' | 'Triage';
    countries?: string[];
    approvalDate?: string;
    denialDate?: string;
}

export interface AdminDashboardContextType {
    isNewSignupsOpen: boolean;
    isExistingUsersOpen: boolean;
    isDeniedUsersOpen: boolean;
    isAddAdminUsersOpen: boolean;

    loadingNewSignups: boolean;
    loadingExistingUsers: boolean;
    loadingDeniedUsers: boolean;

    newSignups: User[];
    existingUsers: User[];
    deniedUsers: User[];

    hasMoreNewSignups: boolean;
    hasMoreExistingUsers: boolean;
    hasMoreDeniedUsers: boolean;

    nextNewSignups: () => void;
    nextExistingUsers: () => void;
    nextDeniedUsers: () => void;

    toggleSection: (section: 'newSignups' | 'existing' | 'denied' | 'addAdmin') => void;
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