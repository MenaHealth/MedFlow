// components/auth/adminDashboard/AdminDashboardView.tsx
'use client'

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useSession } from 'next-auth/react';
import NewSignupsView from './sections/NewSignupsView';
import DeniedDoctorsAndTriage from './sections/DeniedDoctorsAndTriageView';
import ExistingDoctorsAndTriageView from './sections/ExistingDoctorsAndTriageView';
import MedOrdersView from './sections/MedOrdersView';
import ForgotPasswordView from "@/components/auth/adminDashboard/sections/ForgotPasswordView";
import AdminManagement from "@/components/auth/adminDashboard/sections/AdminManagementView";
import ChangeAccountTypeView from "./sections/ChangeAccountTypeView";
import {Loader2, RefreshCw, Users, UserCheck, UserX, BriefcaseMedical, ShieldCheck, RotateCcw, ArrowRightLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

const sections = [
    { id: 'newSignups', title: 'New Signups', icon: Users, color: 'bg-orange-50 text-orange-800', component: NewSignupsView },
    { id: 'existing', title: 'Existing Doctors and Triage', icon: UserCheck, color: 'bg-orange-100 text-orange-500', component: ExistingDoctorsAndTriageView },
    { id: 'denied', title: 'Denied Doctors and Triage', icon: UserX, color: 'bg-gray-100 text-gray-800', component: DeniedDoctorsAndTriage },
    { id: 'addAdmin', title: 'Admin Management', icon: ShieldCheck, color: 'bg-darkBlue text-orange-100', component: AdminManagement },
    { id: 'pwReset', title: 'Password Reset', icon: RotateCcw, color: 'bg-orange-800 text-white', component: ForgotPasswordView },
    { id: 'medOrder', title: 'Medical Orders', icon: BriefcaseMedical, color: 'bg-orange-950 text-white', component: MedOrdersView },
    { id: 'changeAcctType', title: 'Change Account Type', icon: ArrowRightLeft, color: 'bg-gray-200 text-gray-900', component: ChangeAccountTypeView },
] as const;

const AdminDashboardContent = () => {
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { data: session } = useSession();

    const handleToggleSection = (sectionId: typeof sections[number]['id']) => {
        setOpenSection(prev => prev === sectionId ? null : sectionId);
    };

    const handleRefreshAll = () => {
        setIsRefreshing(true);
        // Implement refresh logic for all sections
        setTimeout(() => setIsRefreshing(false), 1000); // Simulated refresh
    };

    const renderSection = (section: typeof sections[number]) => {
        const isOpen = openSection === section.id;
        const SectionComponent = section.component;

        return (
            <div key={section.id} id={section.id} className="mb-6">
                <div className={`sticky top-0 z-10 ${section.color}`}>
                    <button
                        className="w-full p-4 text-left flex items-center justify-between"
                        onClick={() => handleToggleSection(section.id)}
                    >
                        <div className="flex items-center">
                            <section.icon className="mr-2 h-5 w-5" />
                            <h2 className="text-xl">{section.title}</h2>
                        </div>
                        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}> ▼ </span>
                    </button>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
                    <div className={`p-4 ${section.color}`}>
                        {isOpen && <SectionComponent />}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-darkBlue">Admin Dashboard</h1>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefreshAll}
                    disabled={isRefreshing}
                    className="text-orange-500 hover:border-orange-500 border-transparent border-2 focus:outline-none focus:border-orange-500"
                >
                    {isRefreshing ? (
                        <Loader2 className="h-4 w-4 animate-spin"/>
                    ) : (
                        <RefreshCw className="h-4 w-4"/>
                    )}
                </Button>
            </div>

            {sections.map(section => renderSection(section))}
        </div>
    );
};

const AdminDashboardView = () => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AdminDashboardContent />
        </QueryClientProvider>
    );
};

export default AdminDashboardView;