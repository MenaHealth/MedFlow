// components/auth/admin/AdminDashboard.tsx
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import useToast from '@/components/hooks/useToast';
import { useRouter } from 'next/navigation';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import PendingApprovals from './PendingApprovals';
import ExistingUsers from './ExistingUsers';
import DeniedUsers from './DeniedUsers';
import { BarLoader } from 'react-spinners';

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { setToast } = useToast();

    // State to control whether each section is open or collapsed
    const [isPendingApprovalsOpen, setIsPendingApprovalsOpen] = useState(false);
    const [isExistingUsersOpen, setIsExistingUsersOpen] = useState(false);
    const [isDeniedUsersOpen, setIsDeniedUsersOpen] = useState(false);

    // Loading states
    const [loadingPendingApprovals, setLoadingPendingApprovals] = useState(false);
    const [loadingExistingUsers, setLoadingExistingUsers] = useState(false);
    const [loadingDeniedUsers, setLoadingDeniedUsers] = useState(false);

    // States to store the data fetched from the API calls
    const [pendingApprovalsData, setPendingApprovalsData] = useState(null);
    const [existingUsersData, setExistingUsersData] = useState(null);
    const [deniedUsersData, setDeniedUsersData] = useState(null);

    // Toggle section and fetch data if not already loaded
    const toggleSection = async (section: 'pending' | 'existing' | 'denied') => {
        if (section === 'pending') {
            setIsPendingApprovalsOpen((prev) => !prev);
            if (!pendingApprovalsData && !loadingPendingApprovals) {
                setLoadingPendingApprovals(true);
                const data = await fetchPendingApprovals();
                setPendingApprovalsData(data); // Store data in state
                setLoadingPendingApprovals(false);
            }
        } else if (section === 'existing') {
            setIsExistingUsersOpen((prev) => !prev);
            if (!existingUsersData && !loadingExistingUsers) {
                setLoadingExistingUsers(true);
                const data = await fetchExistingUsers();
                setExistingUsersData(data); // Store data in state
                setLoadingExistingUsers(false);
            }
        } else if (section === 'denied') {
            setIsDeniedUsersOpen((prev) => !prev);
            if (!deniedUsersData && !loadingDeniedUsers) {
                setLoadingDeniedUsers(true);
                const data = await fetchDeniedUsers();
                setDeniedUsersData(data); // Store data in state
                setLoadingDeniedUsers(false);
            }
        }
    };

    // Fetch functions for API calls (these can be moved to separate files)
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

    // Handle user permissions and loading state for the session
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
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Pending Approvals */}
            <div>
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('pending')}
                >
                    <h2 className="text-2xl font-semibold mb-4">Pending User Approvals</h2>
                    {isPendingApprovalsOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                </div>
                {isPendingApprovalsOpen && (
                    <div>
                        {loadingPendingApprovals ? (
                            <div className="flex justify-center items-center py-4">
                                <BarLoader color="var(--orange)" />
                            </div>
                        ) : (
                            <PendingApprovals data={pendingApprovalsData} />
                        )}
                    </div>
                )}
            </div>

            {/* Existing Users */}
            <div>
                <div
                    className="flex justify-between items-center cursor-pointer mt-6"
                    onClick={() => toggleSection('existing')}
                >
                    <h2 className="text-2xl font-semibold mb-4">Existing Users</h2>
                    {isExistingUsersOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                </div>
                {isExistingUsersOpen && (
                    <div>
                        {loadingExistingUsers ? (
                            <div className="flex justify-center items-center py-4">
                                <BarLoader color="var(--orange)" />
                            </div>
                        ) : (
                            <ExistingUsers data={existingUsersData} />
                        )}
                    </div>
                )}
            </div>

            {/* Denied Users */}
            <div>
                <div
                    className="flex justify-between items-center cursor-pointer mt-6"
                    onClick={() => toggleSection('denied')}
                >
                    <h2 className="text-2xl font-semibold mb-4">Denied Users</h2>
                    {isDeniedUsersOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                </div>
                {isDeniedUsersOpen && (
                    <div>
                        {loadingDeniedUsers ? (
                            <div className="flex justify-center items-center py-4">
                                <BarLoader color="var(--orange)" />
                            </div>
                        ) : (
                            <DeniedUsers data={deniedUsersData} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}