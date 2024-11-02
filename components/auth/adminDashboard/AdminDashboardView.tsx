// components/auth/adminDashboard/AdminDashboardView.tsx
'use client'

import React from 'react';
import { AdminDashboardProvider } from './AdminDashboardContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAdminDashboard } from './AdminDashboardContext';
import NewSignups from './sections/NewSignups';
import DeniedDoctorsAndTriage from './sections/DeniedDoctorsAndTriage';
import ExistingDoctorsAndTriage from './sections/ExistingDoctorsAndTriage';
import MedOrdersView from './sections/MedOrdersView';
import AdminManagement from "@/components/auth/adminDashboard/sections/AdminManagement";
import { Loader2, RefreshCw, Users, UserCheck, UserX, Pill, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useMedOrdersViewModel } from './sections/MedOrderViewModel';

const sections = [
    { id: 'newSignups', title: 'New Signups', icon: Users, color: 'bg-orange-50 text-orange-800' },
    { id: 'existing', title: 'Existing Doctors and Triage', icon: UserCheck, color: 'bg-orange-100 text-orange-500' },
    { id: 'denied', title: 'Denied Doctors and Triage', icon: UserX, color: 'bg-gray-100 text-gray-800' },
    { id: 'addAdmin', title: 'Admin Management', icon: ShieldCheck, color: 'bg-darkBlue text-orange-100' },
    { id: 'medOrder', title: 'Medical Orders', icon: Pill, color: 'bg-orange-950 text-white' },
] as const;

const AdminDashboardContent = () => {
    const {
        isNewSignupsOpen,
        isExistingUsersOpen,
        isDeniedUsersOpen,
        isAddAdminUsersOpen,
        loadingNewSignups,
        loadingExistingUsers,
        loadingDeniedUsers,
        toggleSection,
        handleRefresh,
        isRefreshing,
    } = useAdminDashboard();

    const {
        loadingMedOrders,
        refetchMedOrders
    } = useMedOrdersViewModel();

    const [isMedOrderOpen, setIsMedOrderOpen] = React.useState(false);

    const sectionRefs = React.useRef<React.RefObject<HTMLDivElement>[]>(sections.map(() => React.createRef<HTMLDivElement>()));

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // You can use setActiveSection here if needed
                        // setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        sectionRefs.current.forEach((ref) => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            sectionRefs.current.forEach((ref) => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, []);

    const handleToggleSection = (sectionId: typeof sections[number]['id']) => {
        if (sectionId === 'medOrder') {
            setIsMedOrderOpen(prev => !prev);
        } else {
            toggleSection(sectionId);
        }
    };

    const handleRefreshAll = () => {
        handleRefresh();
        refetchMedOrders();
    };

    const renderSection = (section: typeof sections[number], index: number) => {
        const isOpen =
            section.id === 'newSignups' ? isNewSignupsOpen :
                section.id === 'existing' ? isExistingUsersOpen :
                    section.id === 'denied' ? isDeniedUsersOpen :
                        section.id === 'addAdmin' ? isAddAdminUsersOpen :
                            section.id === 'medOrder' ? isMedOrderOpen :
                                false;

        const loading =
            section.id === 'newSignups' ? loadingNewSignups :
                section.id === 'existing' ? loadingExistingUsers :
                    section.id === 'denied' ? loadingDeniedUsers :
                        section.id === 'medOrder' ? loadingMedOrders :
                            false;

        const content =
            section.id === 'newSignups' ? <NewSignups /> :
                section.id === 'existing' ? <ExistingDoctorsAndTriage /> :
                    section.id === 'denied' ? <DeniedDoctorsAndTriage /> :
                        section.id === 'addAdmin' ? <AdminManagement /> :
                            section.id === 'medOrder' ? <MedOrdersView /> :
                                null;

        return (
            <div key={section.id} id={section.id} ref={sectionRefs.current[index]} className="mb-6">
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
                        {loading ? (
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
                    onClick={handleRefreshAll}
                    disabled={isRefreshing}
                    className="text-orange-500 hover:border-orange-500 border-transparent border-2 focus:outline-none focus:border-orange-500"
                >
                    {isRefreshing ? (
                        <Loader2  className="h-4 w-4 animate-spin"/>
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