// components/auth/admin/AdminDashboard.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import useToast from '@/components/hooks/useToast';
import { useRouter } from 'next/navigation';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import PendingUsers from './PendingUsers';
import ExistingUsers from './ExistingUsers';
import DeniedUsers from './DeniedUsers';
import { BarLoader } from 'react-spinners';
import AdminManagement from "@/components/auth/admin/AdminManagement";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { setToast } = useToast();

    const [isPendingApprovalsOpen, setIsPendingApprovalsOpen] = useState(false);
    const [isExistingUsersOpen, setIsExistingUsersOpen] = useState(false);
    const [isDeniedUsersOpen, setIsDeniedUsersOpen] = useState(false);
    const [isAddAdminUsersOpen, setIsAddAdminUsersOpen] = useState(false);

    const [loadingPendingApprovals, setLoadingPendingApprovals] = useState(false);
    const [loadingExistingUsers, setLoadingExistingUsers] = useState(false);
    const [loadingDeniedUsers, setLoadingDeniedUsers] = useState(false);

    const [pendingApprovalsData, setPendingApprovalsData] = useState(null);
    const [existingUsersData, setExistingUsersData] = useState(null);
    const [deniedUsersData, setDeniedUsersData] = useState(null);

    const toggleSection = async (section: 'pending' | 'existing' | 'denied' | 'addAdmin' ) => {
        if (section === 'pending') {
            setIsPendingApprovalsOpen((prev) => !prev);
            if (!pendingApprovalsData && !loadingPendingApprovals) {
                setLoadingPendingApprovals(true);
                const data = await fetchPendingApprovals();
                setPendingApprovalsData(data);
                setLoadingPendingApprovals(false);
            }
        } else if (section === 'existing') {
            setIsExistingUsersOpen((prev) => !prev);
            if (!existingUsersData && !loadingExistingUsers) {
                setLoadingExistingUsers(true);
                const data = await fetchExistingUsers();
                setExistingUsersData(data);
                setLoadingExistingUsers(false);
            }
        } else if (section === 'denied') {
            setIsDeniedUsersOpen((prev) => !prev);
            if (!deniedUsersData && !loadingDeniedUsers) {
                setLoadingDeniedUsers(true);
                const data = await fetchDeniedUsers();
                setDeniedUsersData(data);
                setLoadingDeniedUsers(false);
            }
        } else if (section === 'addAdmin') {
            setIsAddAdminUsersOpen((prev) => !prev);
        }
    };

    const fetchPendingApprovals = async () => {
        try {
            const res = await fetch('/api/admin/pending-users');
            if (!res.ok) throw new Error('Failed to fetch pending approvals');
            return await res.json();
        } catch (error) {
            console.error(error);
            setToast?.({
                title: 'Error',
                description: 'Failed to fetch pending approvals.',
                variant: 'error',
            });
            return null;
        }
    };

    const fetchExistingUsers = async () => {
        try {
            const res = await fetch('/api/admin/existing-users');
            if (!res.ok) throw new Error('Failed to fetch existing users');
            return await res.json();
        } catch (error) {
            console.error(error);
            setToast?.({
                title: 'Error',
                description: 'Failed to fetch existing users.',
                variant: 'error',
            });
            return null;
        }
    };

    const fetchDeniedUsers = async () => {
        try {
            const res = await fetch('/api/admin/denied-users');
            if (!res.ok) throw new Error('Failed to fetch denied users');
            return await res.json();
        } catch (error) {
            console.error(error);
            setToast?.({
                title: 'Error',
                description: 'Failed to fetch denied users.',
                variant: 'error',
            });
            return null;
        }
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!session || !session.user?.isAdmin) {
        setToast?.({
            title: 'Error',
            description: 'This page is for admins only.',
            variant: 'error',
        });
        router.push('/');
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-darkBlue text-center">Admin Dashboard</h1>



            {/* Pending Approvals */}
            <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
                <div
                    className="flex justify-between items-center cursor-pointer p-4 bg-orange-50"
                    onClick={() => toggleSection('pending')}
                >
                    <h2 className="text-2xl font-semibold text-orange-800">Pending User Approvals</h2>
                    {isPendingApprovalsOpen ? <ChevronUpIcon className="w-6 h-6 text-orange-500" /> : <ChevronDownIcon className="w-6 h-6 text-orange-800" />}
                </div>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isPendingApprovalsOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="p-4 overflow-x-auto bg-orange-50">
                        {loadingPendingApprovals ? (
                            <div className="flex justify-center items-center py-4">
                                <BarLoader color="var(--orange-500)" />
                            </div>
                        ) : (
                            <PendingUsers data={pendingApprovalsData} />
                        )}
                    </div>
                </div>
            </div>

            {/* Existing Users */}
            <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
                <div
                    className="flex justify-between items-center cursor-pointer p-4 bg-orange-100"
                    onClick={() => toggleSection('existing')}
                >
                    <h2 className="text-2xl font-semibold text-orange-500">Existing Users</h2>
                    {isExistingUsersOpen ? <ChevronUpIcon className="w-6 h-6 text-orange-500" /> : <ChevronDownIcon className="w-6 h-6 text-orange-500" />}
                </div>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExistingUsersOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="p-4 overflow-x-auto bg-orange-100">
                        {loadingExistingUsers ? (
                            <div className="flex justify-center items-center py-4">
                                <BarLoader color="var(--yellow-500)" />
                            </div>
                        ) : (
                            <ExistingUsers data={existingUsersData} />
                        )}
                    </div>
                </div>
            </div>

            {/* Denied Users */}
            <div className="mb-8 bg-grey-100 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
                <div
                    className="flex justify-between items-center cursor-pointer p-4 bg-grey-100"
                    onClick={() => toggleSection('denied')}
                >
                    <h2 className="text-2xl font-semibold text-grey-800">Denied Users</h2>
                    {isDeniedUsersOpen ? <ChevronUpIcon className="w-6 h-6 text-orange-500" /> : <ChevronDownIcon className="w-6 h-6 text-grey-700" />}
                </div>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDeniedUsersOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="p-4 overflow-x-auto bg-grey-100">
                        {loadingDeniedUsers ? (
                            <div className="flex justify-center items-center py-4">
                                <BarLoader color="var(--grey-500)" />
                            </div>
                        ) : (
                            <DeniedUsers data={deniedUsersData} />
                        )}
                    </div>
                </div>
            </div>

            {/* Add Admin Users */}
            <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
                <div
                    className="flex justify-between items-center cursor-pointer p-4 bg-darkBlue"
                    onClick={() => toggleSection('addAdmin')}
                >
                    <h2 className="text-2xl font-semibold text-orange-100">Admin Management</h2>
                    {isAddAdminUsersOpen ? <ChevronUpIcon className="w-6 h-6 text-orange-500" /> : <ChevronDownIcon className="w-6 h-6 text-orange-100" />}
                </div>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAddAdminUsersOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    {/*<div className="p-4 overflow-x-auto">*/}
                        <AdminManagement />
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
}