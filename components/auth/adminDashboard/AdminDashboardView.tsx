// components/auth/adminDashboard/AdminDashboardView.tsx

'use client'

import React, { useRef, useEffect, useState } from 'react';
import { AdminDashboardProvider, useAdminDashboard } from './AdminDashboardContext';
import NewSignups from './sections/NewSignups';
import DeniedDoctorsAndTriage from './sections/DeniedDoctorsAndTriage';
import ExistingDoctorsAndTriage from './sections/ExistingDoctorsAndTriage';
import MedOrders from './sections/MedOrders';
import AdminManagement from "@/components/auth/adminDashboard/sections/AdminManagement";
import { QueryClient, QueryClientProvider } from 'react-query';
import { Loader2, RefreshCw, Users, UserCheck, UserX, Pill, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";

const sections = [
    { id: 'newSignups', title: 'New Signups', icon: Users, color: 'bg-orange-50 text-orange-800' },
    { id: 'existing', title: 'Existing Doctors and Triage', icon: UserCheck, color: 'bg-orange-100 text-orange-500' },
    { id: 'denied', title: 'Denied Doctors and Triage', icon: UserX, color: 'bg-gray-100 text-gray-800' },
    { id: 'addAdmin', title: 'Admin Management', icon: ShieldCheck, color: 'bg-darkBlue text-orange-100' },
    { id: 'medOrder', title: 'Medical Orders', icon: Pill, color: 'bg-darkBlue text-orange-100' },
];

const AdminDashboardContent = () => {
    const {
        isNewSignupsOpen,
        isExistingUsersOpen,
        isDeniedUsersOpen,
        isAddAdminUsersOpen,
        isMedOrderOpen,
        loadingNewSignups,
        loadingExistingUsers,
        loadingDeniedUsers,
        loadingMedOrders,
        newSignupsData,
        existingUsersData,
        deniedUsers,
        medOrdersData,
        toggleSection,
        hasMore,
        next,
        totalPages,
        currentPage,
        setCurrentPage,
        handleRefresh,
        isRefreshing,
    } = useAdminDashboard();

    const [activeSection, setActiveSection] = useState('newSignups');

    const sectionRefs = useRef<React.RefObject<HTMLDivElement>[]>(sections.map(() => React.createRef<HTMLDivElement>()));

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        sectionRefs.current.forEach((ref) => {
            if (ref.current instanceof HTMLDivElement) {
                observer.observe(ref.current);
            }
        });

        return () => {
            sectionRefs.current.forEach((ref) => {
                if (ref.current instanceof HTMLDivElement) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, []);

    const renderSection = (section: typeof sections[number], index: number) => {
        const isOpen = {
            newSignups: isNewSignupsOpen,
            existing: isExistingUsersOpen,
            denied: isDeniedUsersOpen,
            addAdmin: isAddAdminUsersOpen,
            medOrder: isMedOrderOpen,
        }[section.id as 'newSignups' | 'existing' | 'denied' | 'addAdmin' | 'medOrder'];

        const loading = {
            newSignups: loadingNewSignups,
            existing: loadingExistingUsers,
            denied: loadingDeniedUsers,
            addAdmin: false,
            medOrder: loadingMedOrders,
        }[section.id as 'newSignups' | 'existing' | 'denied' | 'addAdmin' | 'medOrder'];

        const content = {
            newSignups: <NewSignups data={newSignupsData} />,
            existing: (
                <ExistingDoctorsAndTriage
                    data={existingUsersData}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            ),
            denied: (
                <DeniedDoctorsAndTriage
                    data={deniedUsers} // use the accumulated deniedUsers state here
                    hasMore={hasMore}
                    loading={loading}
                    next={next}
                />
            ),
            addAdmin: <AdminManagement />,
            medOrder: (
                <MedOrders
                    loadingMedOrders={loadingMedOrders}
                    isRefreshing={isRefreshing}
                    medOrdersData={medOrdersData}
                />
            ),
        }[section.id as 'newSignups' | 'existing' | 'denied' | 'addAdmin' | 'medOrder'];

        return (
            <div key={section.id} id={section.id} ref={sectionRefs.current[index]} className="mb-6">
                <div className={`sticky top-0 z-10 ${section.color}`}>
                    <button
                        className="w-full p-4 text-left flex items-center justify-between"
                        onClick={() => toggleSection(section.id as 'newSignups' | 'existing' | 'denied' | 'addAdmin' | 'medOrder')}
                    >
                        <div className="flex items-center">
                            <h2 className="text-xl">{section.title}</h2>
                        </div>
                        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}> ▼ </span>
                    </button>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
                    <div className={`p-4 ${section.color}`}>
                        {loading || isRefreshing ? (
                            <div className="flex justify-center items-center py-4">
                                <Loader2 className="h-8 w-8 animate-spin"/>
                            </div>
                        ) : (
                            content
                        )}
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
                    onClick={handleRefresh}
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

            {sections.map((section, index) => renderSection(section, index))}
        </div>
    );
};

const AdminDashboardView = () => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AdminDashboardProvider>
                <AdminDashboardContent />
            </AdminDashboardProvider>
        </QueryClientProvider>
    );
};

export default AdminDashboardView;